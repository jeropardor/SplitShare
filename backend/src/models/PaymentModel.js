const db = require('./mysql2');



const Payment = function(payment) {
    this.title = payment.title;
    this.photo = payment.photo;
    this.tag = payment.tag;
    this.amount = payment.amount;
    this.currency = payment.currency;
    this.date = payment.date;
    this.categoryId = payment.categoryId;
    this.userId = payment.userId;
    this.creationDate = payment.creationDate;
};



Payment.create = (newPayment, result) => {
    const questionStatement = 'INSERT INTO Payment SET ?';

    db.query(questionStatement, newPayment, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        
        const paymentId = res.insertId;
        const createdPayment = {id: paymentId, ...newPayment};
        result(null, createdPayment);
    });
};



Payment.findAll = (user, limit, offset, result) => {
    let queryStatement = 'SELECT * FROM Payment WHERE billId = ?';
    if (limit) queryStatement += ' LIMIT ' + limit;
    if (offset) queryStatement += ' OFFSET ' + offset;

    db.query(queryStatement, [user], (err, res, fields) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        if (res.length) {
            return result(null, res);
        }
        // not found Exam
        result({ kind: "not_found" }, null);
    });
};



// Exam.findById = (id, result) => {
//     let queryStatement = 'SELECT * FROM exam WHERE examId = ?';

//     db.query(queryStatement, [id], (err, res, fields) => {
//         if (err) {
//             console.log("error: ", err);
//             return result(err, null);
//         }
//         if (res.length) {
//             return result(null, res[0]);
//         }
//         // not found Exam
//         result({ kind: "not_found" }, null);
//     });
// };



// Exam.updateById = (id, Exam, result) => {
//     sql.query(
//         "UPDATE Questions SET ExamName = ? WHERE ExamId = ?",
//         [Exam.ExamName, id],
//         (err, res) => {
//             if (err) {
//                 console.log("error: ", err);
//                 return result(null, err);
//             }
//             if (res.affectedRows == 0) {
//                 // not found Exam with the id
//                 return result({ kind: "not_found" }, null);
//             }
//             result(null, { ExamId: id, ...Exam });    
//         });
// };



// Exam.remove = (id, result) => {
//     db.query("DELETE FROM exam WHERE examId = ?", id, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             return result(err, null);
//         }
//         if (res.affectedRows == 0) {
//             // not found Exam with the id
//             return result({ kind: "not_found" }, null);
//         }
//         result(null, res);
//     });
// };



module.exports = Bill;