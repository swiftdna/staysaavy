const express = require("express");
//const moment = require('moment');

const router = express.Router();
const session = require("express-session");
let mysql = require("mysql");

let cors = require("cors");
const { check, validationResult } = require("express-validator");

router.use(cors());
const User = require("../models/User");
const e = require("express");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const { checkAuth, auth } = require("../utils/passport");

auth();

let connection = mysql.createConnection({
  host: "database-1.crrtrlvp5oef.us-east-2.rds.amazonaws.com",
  database: "staysaavy",
  port: "3306",
  user: "admin",
  password: "password",
});

// get the room available data in specified range data in a particular hotel
router.post("/getrooms", checkAuth, (req, res) => {
  // console.log(req.user);
  let summer_start_date = new Date("05/01/2022"); // either mm/dd/yyyy format or yyyy-mm-dd
  //console.log("the summer type of date is " , typeof(summer_start_date));
  //console.log("the summer type of date is " , summer_start_date);
  let summer_end_date = new Date("06/30/2022");
  let christmas_start_date = new Date("12/20/2022");
  let christmas_end_date = new Date("01/10/2023");
  let customer_type = req.user.customer_type;
  let customer_loyalty_discount = 0;
  let holidays_count = 0;
  if (customer_type == "gold") {
    customer_loyalty_discount = 0.8;
  }
  if (customer_type == "silver") {
    customer_loyalty_discount = 0.9;
  }
  //console.log("test",customer_loyalty_discount);

  let {
    hotel_id,
    start_date,
    end_date,
    daily_continental_breakfast,
    access_to_swimming_pool,
    access_to_fitness_room,
    daily_parking,
  } = req.body;
  //console.log("the type of date is " , typeof(start_date));
  if (
    daily_continental_breakfast == 0 &&
    access_to_swimming_pool == 0 &&
    access_to_fitness_room == 0 &&
    daily_parking == 0
  ) {
    try {
      connection.query(
        `select * from  hotel where hotel_id=? `,
        [hotel_id],
        function (error, hotel_results) {
          connection.query(
            `select roomtypename,maxguests,description,roombaseprice,count(*) as numberofrooms from room  where room.hotel_id=? and room.room_id not
    in (select room_id from reservation where start_date between ? and ? or end_date between ? and ?) group by roomtypename order by roombaseprice`,
            [hotel_id, start_date, end_date, start_date, end_date],
            function (error, results) {
              //console.log(typeof(start_date))
              //console.log("actua",start_date)
              //console.log("moment",moment(start_date).format("")
              let res_start_date = new Date(start_date);

              //console.log("converted",res_start_date)
              let res_end_date = new Date(end_date);
              //console.log("the type of converted date is " , typeof(res_start_date));
              //console.log(typeof(start_date))
              console.log("reservation start date", res_start_date);
              console.log("reservation end date", res_end_date);

              console.log(
                "res_start_date_date_string",
                res_start_date.toDateString()
              );
              console.log(
                "res_end_date_date_string",
                res_end_date.toDateString()
              );
              if (results && results.length !== 0) {
                let diff = Math.abs(res_start_date - res_end_date); // in milliseconds
                let ms_per_day = 1000 * 60 * 60 * 24;
                let days = diff / ms_per_day + 1; // convert to days and add 1 for inclusive date range
                //console.log("diff and days are ",diff,days)
                if (
                  (res_start_date >= summer_start_date &&
                    res_start_date <= summer_end_date &&
                    res_end_date >= summer_start_date &&
                    res_end_date <= summer_end_date) ||
                  (res_start_date >= christmas_start_date &&
                    res_start_date <= christmas_end_date &&
                    res_end_date >= christmas_start_date &&
                    res_end_date <= christmas_start_date)
                ) {
                  //console.log("in summer season if codition")
                  for (let i = 0; i < results.length; i++) {
                    results[i].roomdiscountedprice = Math.trunc(
                      customer_loyalty_discount *
                        days *
                        results[i].roombaseprice * 1.2
                    );
                    results[i].roombaseprice = Math.trunc(
                      days * results[i].roombaseprice * 1.2
                    );
                  }
                  res.json({
                    success: true,
                    data: {
                      ...hotel_results[0],
                      rooms: results
                    }
                  });
                } else {
                  let mod = days % 7;
                  let full_weeks = (days - mod) / 7;

                  let weekend_days = full_weeks * 2;
                  console.log(
                    "mod,full_weeks,weekend_days",
                    mod,
                    full_weeks,
                    weekend_days
                  );

                  if (mod != 0) {
                    // iterate through remainder days
                    let startPartialWeek = new Date();
                    let endPartialWeek = res_end_date;
                    console.log("endpartialweek", endPartialWeek);
                    startPartialWeek.setTime(
                      res_end_date.getTime() - (mod - 1) * ms_per_day
                    );
                    //startPartialWeek.setDate(res_end_date.getDate() - (mod-1));
                    //console.log("startpartialweek",(startPartialWeek.getDay()));
                    //console.log("startpartialweek",(startPartialWeek.getVarDate()));
                    // startPartialWeek = startPartialWeek.setDate(startPartialWeek.getDate() + 1);
                    console.log("startpartialweek", startPartialWeek);
                    for (
                      var d = startPartialWeek;
                      d <= endPartialWeek;
                      d.setDate(d.getDate() + 1)
                    ) {
                      //console.log("+");
                      if (d.getDay() == 0 || d.getDay() == 6) {
                        holidays_count++;
                        console.log(
                          "in final",
                          d.getDate(),
                          "get the day",
                          d.getDay(),
                          "days count",
                          holidays_count
                        );
                      }
                    }
                  }

                  console.log("weekend count", holidays_count);

                  let holidays = [
                    new Date("05/18/2022"),
                    new Date("05/17/2022"),
                    new Date("04/02/2022"),
                  ];
                  let totalHolidays = 0;
                  console.log(
                    "res_start_date_date_string",
                    res_start_date.toDateString()
                  );
                  console.log(
                    "res_end_date_date_string",
                    res_end_date.toDateString()
                  );
                  for (let i = 0; i < holidays.length; i++) {
                    console.log(holidays[i].toDateString());
                    console.log(holidays[i]);

                    let d = holidays[i].getDay(); //Make sure holiday is not a weekendday!
                    console.log("get day", d);
                    //console.log("start_date",typeof(start_date));
                    //onsole.log("end_date",end_date);

                    //console.log("in for loop")
                    if (
                      holidays[i] >= res_start_date &&
                      holidays[i] <= res_end_date &&
                      !(d == 0 || d == 6)
                    ) {
                      //console.log("in if loop")
                      holidays_count = holidays_count + 1;
                    }
                  }
                  console.log("total actual holidays", holidays_count);

                  for (let i = 0; i < results.length; i++) {
                    console.log(
                      results[i].roombaseprice,
                      customer_loyalty_discount,
                      holidays_count,
                      days,
                      days - holidays_count
                    );
                    results[i].roomdiscountedprice = Math.trunc(
                      customer_loyalty_discount *
                        results[i].roombaseprice *
                        (days - holidays_count + holidays_count * 1.1)
                    );
                    results[i].roombaseprice = Math.trunc(
                      results[i].roombaseprice *
                        (days - holidays_count + holidays_count * 1.1)
                    );
                  }
                  //res.send(JSON.stringify(results));
                  res.json({
                    success: true,
                    data: {
                      ...hotel_results[0],
                      rooms: results
                    }
                  });
                }
              } else {
                res.send("failure");
              }
            }
          );
        }
      );
    } catch (err) {
      console.error(err.message);
      res.send("server error");
    }
  } else {
    let count = 0;
    if (daily_continental_breakfast == 1) {
      count = count + 1;
      daily_continental_breakfast = "Daily Continental Breakfast";
    } else {
      daily_continental_breakfast = "";
    }
    if (access_to_fitness_room == 1) {
      count = count + 1;
      access_to_fitness_room = "Access to fitness room";
    } else {
      access_to_fitness_room = "";
    }
    if (access_to_swimming_pool == 1) {
      count = count + 1;
      access_to_swimming_pool = "Access to Swimming Pool";
    } else {
      access_to_swimming_pool = "";
    }
    if (daily_parking == 1) {
      count = count + 1;
      daily_parking = "Daily Parking";
    } else {
      daily_parking = "";
    }
    try {
      connection.query(
        `select * from  hotel where hotel_id=? `,
        [hotel_id],
        function (error, hotel_results) {
          connection.query(
            `SELECT roomtypename FROM facilities
         WHERE amenities IN (?,?,?,?) GROUP BY roomtypename HAVING COUNT(*) = ?`,
            [
              daily_continental_breakfast,
              access_to_swimming_pool,
              access_to_fitness_room,
              daily_parking,
              count,
            ],
            function (error, results) {
              if (error) {
                //res.send(JSON.stringify(results));
                res.json({success: false, message: error.message});
              } else {
                res.json({
                  success: true,
                  data: {
                    ...hotel_results[0],
                    rooms: results
                  }
                });
              }
            }
          );
        }
      );
    } catch (err) {
      console.error(err.message);
      res.send("server error");
    }
  }
});

router.get('/room_types', checkAuth, (req, res) => {
    try {
        connection.query(`select * from room_type`, (err, results) => {
            res.json({
                success: true,
                data: results
            });
        });

    } catch (err) {
        res.json({
            success: false,
            data: err.message
        });
    }
});

module.exports = router;
