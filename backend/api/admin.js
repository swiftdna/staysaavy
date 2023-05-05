const express = require("express");
const router = express.Router();
const session = require("express-session");
var mysql = require("mysql");
var util = require("util");

var cors = require("cors");
const { check, validationResult } = require("express-validator");
const { createRoom } = require('./logics');

router.use(cors());
const User = require("../../models/User");
const e = require("express");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

var connection = mysql.createConnection({
  host: "database-1.cerbnelrueyi.us-east-1.rds.amazonaws.com",
  database: "staysaavy",
  port: "3306",
  user: "admin",
  password: "password",
});

//admin adding a hotel
router.post("/addhotel", [], async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    //res.send(errors.code);
    return res.status(500).json({ errors: errors.array() });
  }
  const {
    hotel_name,
    hotel_addr,
    hotel_phone,
    city,
    summary,
    description,
    hotelbaseprice,
    image,
    rooms
  } = req.body;
  try {
    connection.query(
      `INSERT INTO hotel(hotel_name, hotel_addr, hotel_phone,city,summary,description,hotelbaseprice,image) values(?,?,?,?,?,?,?,?)`,
      [
        hotel_name,
        hotel_addr,
        hotel_phone,
        city,
        summary,
        description,
        hotelbaseprice,
        image,
      ],
      async (error, results) => {
        if (error) {
          //res.send(error.code);
          res.status(400).json("failure");
        } else {
          // Add rooms now
          const {insertId: hotel_id} = results;
          const creationReqs = [];
          for (let i=0; i < rooms.length; i++) {
            const roomtypename = rooms[i].roomtypename;
            const numberofrooms = rooms[i].count;
            const createRoomObj = {
              body: {
                hotel_id,
                roomtypename,
                numberofrooms
              }
            };
            const createRoomFn = util.promisify(createRoom);
            creationReqs.push(createRoomFn(createRoomObj));
          }
          const roomReqsResults = await Promise.all(creationReqs);
          console.log('creationRes => ', roomReqsResults);
          res.json({
            success: true,
            roomReqsResults
          });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("database error");
  }
});

// listing all the hotels for admin and he can filter based on the city name if required.
router.get("/getallhotels", [], async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    //res.send(errors.code);
    return res.status(500).json({ errors: errors.array() });
  }
  const city = req.query.city;
  try {
    let temp = `'%${city}%'`;
    connection.query(
      `SELECT * FROM hotel WHERE city like ${temp}`, {raw: true},
      function (error, results) {
        if (results && results.length !== 0) {
          res.json({ success: true, data: results });
        } else {
          res.json({ success: true, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

// admin viewing the bookings in a particular hotel
router.get("/getbookings", [], async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    //res.send(errors.code);
    return res.status(500).json({ errors: errors.array() });
  }
  const hotel_id = req.query.hotel_id;
  try {
    connection.query(
      `SELECT * FROM reservation WHERE hotel_id=?`,
      [hotel_id],
      function (error, results) {
        if (results && results.length !== 0) {
          res.status(200).json({ success: true, data: results });
        } else {
          res.send("failure");
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

//admin editing a hotel
router.put("/edithotel", [], async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    //res.send(errors.code);
    return res.status(500).json({ errors: errors.array() });
  }
  const {
    hotel_name,
    hotel_addr,
    hotel_phone,
    city,
    summary,
    description,
    hotelbaseprice,
    image,
    hotel_id,
  } = req.body;
  try {
    connection.query(
      `UPDATE hotel set hotel_name=?, hotel_addr=?, hotel_phone=?,city=?,summary=?,description=?,hotelbaseprice=?,image=? where hotel_id=?`,
      [
        hotel_name,
        hotel_addr,
        hotel_phone,
        city,
        summary,
        description,
        hotelbaseprice,
        image,
        hotel_id,
      ],
      function (error, results) {
        if (error) {
          //res.send(error.code);
          res.status(400).json("failure");
        } else {
          res.json({
            success: true,
            results,
          });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("database error");
  }
});



module.exports = router;

