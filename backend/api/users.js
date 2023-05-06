const express = require("express");
const router = express.Router();
const session = require("express-session");
var mysql = require("mysql");
//var constraints = require("../../config.json");
var cors = require("cors");
const { check, validationResult } = require("express-validator");
//const app = express();
router.use(cors());
const User = require("../models/User");
const e = require("express");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
auth();
//app.use(express.json({extended: false}));

//For route use  GET api/users
//router.get('/',(req,res) => res.send('User Route'));

/*
var connection = mysql.createPool({
    host: constraints.DB.host,
    user:constraints.DB.username,
    password: constraints.DB.password,
    port: constraints.DB.port,
    database: constraints.DB.database
});
*/

var connection = mysql.createConnection({
  host: "database-1.crrtrlvp5oef.us-east-2.rds.amazonaws.com",
  database: "staysaavy",
  port: "3306",
  user: "admin",
  password: "password",
});

connection.connect((err) => {
  if (err) {
    throw "Error occured " + err;
  }
  console.log("pool created");
});

router.post(
  "/signup",
  [
    check("cust_name", "Name is required").not().isEmpty(),
    check("cust_email", "Please enter a valid email").isEmail(),
    check("cust_phone", "Phone is required").not().isEmpty(),
    check(
      "cust_password",
      "password should be minimum of length 6 charcaters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    var value = req.body.cust_password;
    const salt = await bcrypt.genSalt(10);
    value = await bcrypt.hash(value, salt);
    if (!errors.isEmpty()) {
      //res.send(errors.code);
      return res.status(500).json({ errors: errors.array() });
    }
    const { cust_name, cust_email, cust_phone, cust_password } = req.body;
    try {
      connection.query(
        `SELECT cust_email FROM customer WHERE cust_email=?`,
        [cust_email],
        function (error, results) {
          if (results.length === 0) {
            console.log("New user");
            connection.query(
              `Insert into customer(cust_name,cust_email,cust_phone,cust_password) values(?,?,?,?)`,
              [cust_name, cust_email, cust_phone, value],
              function (error, results) {
                if (error) {
                  res.status(400).send(error.message);
                } else {
                  res.json({success: true, data: results});
                }
              }
            );
          } else {
            //console.log("User already existed!");
            res.status(400).json({success: false, message: "user already exists"});
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    }
  }
);

router.post(
  "/login",
  [
    check("cust_email", "Please enter a valid email").isEmail(),
    check("cust_password", "password is required").exists(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    const { cust_email, cust_password } = req.body;
    try {
      connection.query(
        `SELECT * FROM customer WHERE cust_email=?`,
        [cust_email],
        function (error, results) {
          if (results && results.length !== 0) {
            console.log(results[0].cust_password);
            bcrypt.compare(
              cust_password,
              results[0].cust_password,
              function (err, isMatch) {
                if (err) {
                  throw err;
                } else if (!isMatch) {
                  res.status(401).send("failure");
                } else {
                  const payload = { cust_email: results[0].cust_email };
                  const token = jwt.sign(payload, secret, {
                    expiresIn: 10080000,
                  });
                  res.cookie("nc_token", token, { httpOnly: true });
                  res.json({ success: true, token, user: {...results[0], isLoggedIn: true}, isLoggedIn: true });
                }
              }
            );
          } else {
            res.status(401).send("invalid credentials");
          }
        }
      );
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

module.exports = router;
