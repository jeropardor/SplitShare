const db = require('./mysql2');



const Bill = function(bill) {
    this.title = bill.title;
    this.description = bill.description;
    this.currency = bill.currency;
    this.categoryId = bill.categoryId;
    this.userId = bill.userId;
    this.creationDate = bill.creationDate;
};



Bill.create = (newBill, result) => {
    const questionStatement = 'INSERT INTO Bill SET ?';

    db.query(questionStatement, newBill, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        
        const billId = res.insertId;
        const createdBill = {id: billId, ...newBill};
        result(null, createdBill);
    });
};



Bill.findAll = (user, limit, offset, result) => {
    let queryStatement = 'SELECT * FROM Bill WHERE userId = ?';
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