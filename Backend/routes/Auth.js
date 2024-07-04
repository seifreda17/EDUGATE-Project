const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");



const app = express();







// REGISTRATION
router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("name")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 3})
    .withMessage("Name should be between 3 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters"),
    body("phone")
    .isLength({ min: 5 })
    .withMessage("Please Enter valid Phone"),

  async (req, res) => {
    try {
      // 1- Validate request (manual, express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- Check if email exists
      const query = util.promisify(conn.query.bind(conn));
      const isEmailExists = await query("SELECT * FROM users WHERE email = ?", [
        req.body.email,
      ]);
      if (isEmailExists.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "Email already exists",
            },
          ],
        });
      }

      // 3- Prepare user object to save
      const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: await bcrypt.hash(req.body.password, 10),
       
      };

      // 4- Insert user object in DB
      await query("INSERT INTO users SET ?", userData);
      const token = jwt.sign({ email: userData.email }, "your_secret_key_here");
      delete userData.password;
      return res.status(200).json({ message: "User registered successfully", token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err });
    }
  }
);


router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be at least 3 characters"),
  async (req, res) => {
    try {
      // 1- Validate request (manual, express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- Check if email exists
      const query = util.promisify(conn.query.bind(conn));
      const user = await query("SELECT * FROM users WHERE email = ?", [
        req.body.email,
      ]);
      if (user.length == 0) {
        return res.status(404).json({
          errors: [
            {
              msg: "Email or password not found",
            },
          ],
        });
      }

      // 3- Compare password
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isPasswordValid) {
        delete user[0].password;

        // Generate JWT token
        const token = jwt.sign(
          { userId: user[0].user_id, email: user[0].email }, // Note the change here
          "your_secret_key_here",
          { expiresIn: "1444h" } // Token expires in 60 days (1440 hours)
        );

        // Update user's token in the database
        await query("UPDATE users SET token = ? WHERE user_id = ?", [token, user[0].user_id]);

        return res.status(200).json({
          role: user[0].role,
          token: token, // Note the change here to use the new token
          user_id: user[0].user_id, // Include the user_id in the response
        });
      } else {
        return res.status(404).json({
          errors: [
            {
              msg: "Email or password not found",
            },
          ],
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err });
    }
  }
);







// Server-side logout route
router.post('/logout', async (req, res) => {
  try {
    const query = util.promisify(conn.query.bind(conn));
    const userId = getUserIdFromToken(req.headers.authorization); // Implement this function to extract user ID from the JWT token
    await query('UPDATE users SET token = NULL WHERE user_id = ?', [userId]);
    res.status(200).json({ msg: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server error' });
  }
});








module.exports = router;