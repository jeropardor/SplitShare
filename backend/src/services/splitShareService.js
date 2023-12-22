require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../models/mysql2');
const util = require('util');

const User = require('../models/UserModel');
const Bill = require('../models/BillModel');
// const Exam = require('../models/ExamModel');




exports.createUser = async (req, res) => {
    // Validate request
    if (!req.body)
        return res.status(400).send({ message: "Content can not be empty!" });
    if (!req.body.username || !req.body.email || !req.body.password)
        return res.status(400).send({ message: "Wrong body content..." });
    // Create a User
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        creationDate: new Date()
    });
    // Save User in the database
    User.create(user, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User"
            });
        else res.send(data);
    });
};


exports.login = (req, res) => {
    User.findByEmail(req.body.email, async (err, user) => {
        if (err) {
            if (err.kind === "not_found")
                return res.status(404).send({ message: "Invalid credentials" });
            else
                return res.status(500).send({ message: "Error retrieving user with email " + req.body.email });
        }
        // Verify psw
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid credentials" });
        }        
        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT, { expiresIn: "1h" })
        // Send token
        res.json({ token: token });
    });
};



exports.createBill = (req, res) => {
    console.log(req.user);
    // Validate request
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }
    if (!req.body.title || !req.body.description || !req.body.currency || !req.body.userId)
        return res.status(400).send({ message: "Wrong body content..." });
    // Create a Bill
    const bill = new Bill({
        title: req.body.title,
        description: req.body.description,
        currency: req.body.currency,
        categoryId: req.body?.categoryId,
        userId: req.body.userId,
        creationDate: new Date()
    });
    // Save Bill in the database
    Bill.create(bill, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Bill"
            });
        else res.send(data);
    });
};


exports.getBillListByUser = (req, res) => {
    if (!req.query.user) {
        res.status(400).send({ message: "User must be provided!" });
    }
    if (req.query.user != req.user.id) {
        return res.status(403).send({ message: "You do not have access permission to this resource" });
      }
    const limit = req.query.limit ?? null;
    const offset = req.query.offset ?? null;
    Bill.findAll(req.query.user, limit, req.query.offset, (err, data) => {
        if (err) {
            if (err.kind === "not_found") 
                // res.status(404).send({ message: `Bills not found.`});
                res.send([]);

            else res.status(500).send({ message: "Could not get the Bills" });

        } else res.send(data);
    });
};




























/* // Create a new Question
exports.createQuestion = (req, res) => {
    // Validate request
    if (!req.body || !req.body.hasOwnProperty('answers')) {
        res.status(400).send({ message: 'Content can not be empty!'  });
    }
    // Create a Question
    const question = new Question({
        questionText:   req.body.questionText,
        questionDate:   req.body.questionDate,
        themeId:        req.body.themeId,
    });
    // Save Question in the database
    Question.create(question, req.body.answers, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Question."
            });
        else res.send(data);
    });
};


// Create a new Question
exports.bulkCreateQuestions = (req, res) => {    
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty!'  });
    }
    for (const [i, question] of req.body.entries()) {
        const newAnswers = question.answers;
        delete question.answers;
        Question.create(question, newAnswers, (err, data) => {
            if (err)
                res.status(500).send({
                    message: err.message || "Some error occurred while creating one of the questions."
                });
            else {
                if(i == req.body.length-1) res.send(data);
            }
        });
    }
};




// Retrieve N random questions
exports.findRandomQuestions = async (req, res) => {
    async function getQuestionNum() {
        const [rows, fields] = await db.promise().query('SELECT COUNT(*) as num FROM question;');
        return rows[0].num;
    }

    const getRandoms = (limit, max) => {
        const arr = [];
        if (limit > max) limit = max;
        while(arr.length < limit){
            let r = Math.floor(Math.random() * (max) + 1);
            if(arr.indexOf(r) === -1) arr.push(r);
        }
        return arr;
    }

    const limit = req.query.limit ?? 10;
    const questionNum = await getQuestionNum();
    const randoms = getRandoms(limit, questionNum);

    Question.findByIds(randoms, (err, data) => {
        if (err) {
          if (err.kind === "not_found") res.status(404).send({ message: `Not found Question with id ${req.params.id}.`});
          else {
            res.status(500).send({
              message: "Could not delete Question with id " + req.params.id
            });
          }
        } else res.send(data);
    });
};



exports.findAllQuestions = (req, res) => {
    const limit = req.query.limit ?? config.DEFAULT_LIMIT;
    Question.findAll(limit, req.query.offset, (err, data) => {
        if (err) {
            if (err.kind === "not_found") 
                // res.status(404).send({ message: `Questions not found.`});
                res.send([]);

            else res.status(500).send({ message: "Could not get the questions" });

        } else res.send(data);
    });
};



// Delete a Tutorial with the specified id in the request
exports.deleteQuestion = (req, res) => {
    Question.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") res.status(404).send({ message: `Not found Question with id ${req.params.id}.`});
          else {
            res.status(500).send({
              message: "Could not delete Question with id " + req.params.id
            });
          }
        } else res.send({ message: `Question was deleted successfully!` });
    });
};



exports.findAllThemes = (req, res) => {
    Theme.findAll((err, data) => {
        if (err) {
          if (err.kind === "not_found") res.status(404).send({ message: `Themes not found.`});
          else res.status(500).send({ message: "Could not get the themes" });
        
        } else res.send(data);
    });
};



exports.createExam = (req,res) => {
    if (!req.body || !req.body.hasOwnProperty('questions')) {
        res.status(400).send({ message: 'Content can not be empty!' });
    }
    // Create a Exam
    const exam = new Exam({
        examName: req.body.examName,
        examCreationDate: req.body.examCreationDate,
    });
    // Save Exam in the database
    Exam.create(exam, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Exam."
            });
        
        const exam = data;
        Exam.fill(exam.examId, req.body.questions, (err, data) => {
            if (err)
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the Exam."
                });
            
            res.send(exam);
        })
    });
}



exports.createFullExam = async (req,res) => {    
    if (!req.body || !req.body.hasOwnProperty('questions')) {
        res.status(400).send({ message: 'Content can not be empty!' });
    }
    
    const asyncCreate = util.promisify(Question.create);
    const questionIds = [];

    for (const [i, question] of req.body.questions.entries()) {
        const newAnswers = question.answers;
        delete question.answers;

        try {
            const queRes = await asyncCreate(question, newAnswers);
        } catch (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Exam."
            })
        }
        questionIds.push(queRes.questionId);
    }


    // Create a Exam
    const exam = new Exam({
        examName: req.body.examName,
        examCreationDate: req.body.examCreationDate,
    });
    // Save Exam in the database
    Exam.create(exam, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Exam."
            });
        
        Exam.fill(data.examId, questionIds, (err, data) => {
            if (err)
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the Exam."
                });
            
            res.send(data);
        })
    });
}



exports.findExam = (req, res) => {
    Question.findByExamId(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Not found Exam with id ${req.params.id}.` });
            } else {
                res.status(500).send({ message: "Error retrieving Exam with id " + req.params.id });
            }
            return;
        }
        Exam.f
        res.send(data);
    });
};



exports.findAllExams = (req, res) => {
    const limit = req.query.limit ?? config.DEFAULT_LIMIT;
    Exam.findAll(limit, req.query.offset, (err, data) => {
        if (err) {
            if (err.kind === "not_found") 
                // res.status(404).send({ message: `Themes not found.`});
                res.send([]);

            else res.status(500).send({ message: "Could not get the themes" });
        
        } else res.send(data);
    });
};




exports.findExamInfo = (req, res) => {
    Exam.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") 
                res.status(404).send({ message: `Themes not found.`});
            else res.status(500).send({ message: "Could not get the themes" });
        
        } else res.send(data);
    });
}; */