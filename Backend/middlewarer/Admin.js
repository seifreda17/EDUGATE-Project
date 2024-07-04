// // const connection = require("../db/dbConnection");
// // const util = require("util");

// // const admin = async (req, res, next) => {
// //     const query = util.promisify(connection.query).bind(connection);
// //     const { token } = req.headers;
// //     const admin = await query("select * from users where token = ?", [token])
// //     if (admin[0] && admin[0].role === "1") {
// //         res.locals.users = admin[0];
// //         next();
// //     }
// //     else {
// //         res.status(403).json({
// //             msg: "you are not authorized to access this route !",
// //         })
// //     }

// // }
// // module.exports = admin;
// const admin = async (req, res, next) => {
//     const query = util.promisify(connection.query).bind(connection);
//     const { token } = req.headers;
//     console.log("Token:", token); // Log the token

//     const admin = await query("select * from users where token = ?", [token])
//     console.log("Admin:", admin); // Log the admin object

//     if (admin[0] && admin[0].role === 1) { // Compare as integer
//         res.locals.users = admin[0];
//         next();
//     }
//     else {
//         res.status(403).json({
//             msg: "you are not authorized to access this route !",
//         })
//     }
// }

const conn = require("../db/dbConnection");
const util = require("util"); // helper

const admin = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const { token } = req.headers;
  const admin = await query("select * from users where token = ?", [token]);
  if (admin[0] && admin[0].role == "1") {
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = admin;