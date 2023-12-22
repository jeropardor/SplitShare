require('dotenv').config();
const jwt = require('jsonwebtoken');

const splitShareService = require("../services/splitShareService")


module.exports = (app) => {
    var router = require("express").Router();

    router.post("/user", splitShareService.createUser);
    router.post("/login", splitShareService.login);

    // Auth middleware
    function authMiddleware(req, res, next) {
        const token = req.headers['authorization'];      
        if (!token) {
          return res.status(401).json({ message: 'Auth token not found' });
        }
        jwt.verify(token, process.env.JWT, (err, user) => {
          if (err) {
            return res.status(403).json({ message: 'Invalid auth token' });
          }
          req.user = user;
          next();
        });
    }

    router.post("/bill", authMiddleware, splitShareService.createBill);
    router.get("/bills", authMiddleware, splitShareService.getBillListByUser);







    
/*     // Create a new Question
    router.post("/question", questionService.createQuestion);
    // Find random questions
    router.get("/question", questionService.findRandomQuestions);
    // Delete a Tutorial with id
    router.delete("/question/:id", questionService.deleteQuestion);

    // create exam
    router.post("/exam", questionService.createExam)
    // get exam
    router.get("/exam/:id", questionService.findExam);
    // Get exam info
    router.get("/exams/:id", questionService.findExamInfo);



    // limit and offset can be used
    // Get all questions
    router.get("/questions", questionService.findAllQuestions);
    // Get all themes
    router.get("/themes", questionService.findAllThemes);
    // Get exams
    router.get("/exams", questionService.findAllExams);



    // Create more than one question in one go
    router.post("/script/questions", questionService.bulkCreateQuestions);
    // Create a full exam in one go
    router.post("/script/exam", questionService.createFullExam); */

    

    app.use('/api/', router);
};