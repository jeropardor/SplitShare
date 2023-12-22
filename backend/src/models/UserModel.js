const db = require('./mysql2');



const User = function(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.creationDate = user.creationDate;
};



User.create = (newUser, result) => {
    const questionStatement = 'INSERT INTO User SET ?';
    db.query(questionStatement, newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        
        const userId = res.insertId;
        const createdUser = {id: userId, ...newUser};
        result(null, createdUser);
    });
};


User.findById = (id, result) => {
    let queryStatement = 'SELECT * FROM User WHERE id = ?';

    db.query(queryStatement, [id], (err, res, fields) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        if (res.length) {
            return result(null, res[0]);
        }
        // not found User
        result({ kind: "not_found" }, null);
    });
};


User.findByEmail = (email, result) => {
    let queryStatement = 'SELECT * FROM User WHERE email = ?';

    db.query(queryStatement, [email], (err, res, fields) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        if (res.length) {
            return result(null, res[0]);
        }
        // not found User
        result({ kind: "not_found" }, null);
    });
};

// User.updateById = (id, User, result) => {
//     sql.query(
//         "UPDATE Questions SET UserName = ? WHERE UserId = ?",
//         [User.UserName, id],
//         (err, res) => {
//             if (err) {
//                 console.log("error: ", err);
//                 return result(null, err);
//             }
//             if (res.affectedRows == 0) {
//                 // not found User with the id
//                 return result({ kind: "not_found" }, null);
//             }
//             result(null, { UserId: id, ...User });    
//         });
// };



User.remove = (id, result) => {
    db.query("DELETE FROM User WHERE UserId = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return result(err, null);
        }
        if (res.affectedRows == 0) {
            // not found User with the id
            return result({ kind: "not_found" }, null);
        }
        result(null, res);
    });
};



module.exports = User;