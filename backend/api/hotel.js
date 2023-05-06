const express = require("express");
const router = express.Router();
const session = require("express-session");
var mysql = require("mysql");

var cors = require("cors");
const { check, validationResult } = require("express-validator");

router.use(cors());
const User = require("../models/User");
const e = require("express");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

var connection = mysql.createConnection({
  host: "database-1.crrtrlvp5oef.us-east-2.rds.amazonaws.com",
  database: "staysaavy",
  port: "3306",
  user: "admin",
  password: "password",
});

// customer searching for available hotels in a city along with his dates of stay.
router.get("/gethotels", [], async (req, res) => {
  const errors = validationResult(req);
  let summer_start_date = new Date("05/01/2022"); // either mm/dd/yyyy format or yyyy-mm-dd
  let summer_end_date = new Date("06/30/2022");
  let christmas_start_date = new Date("12/20/2022");
  let christmas_end_date = new Date("01/10/2023");
  let holidays_count = 0;
  console.log(errors);
  if (!errors.isEmpty()) {
    //res.send(errors.code);
    return res.status(500).json({ errors: errors.array() });
  }
  const { city, start_date, end_date } = req.query;
  try {
    connection.query(
      `select * from  hotel where hotel.city=? and hotel.hotel_id in (select hotel_id from room  where room.room_id not in 
            (select room_id from reservation where start_date between ? and ? or end_date between ? and ?))`,
      [city, start_date, end_date, start_date, end_date],
      function (error, results) {
        if (results && results.length !== 0) {
          console.log(results);
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
          console.log("res_end_date_date_string", res_end_date.toDateString());
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
            console.log("in summer season if codition");
            for (let i = 0; i < results.length; i++) {
              results[i].hotelbaseprice = Math.trunc(
                days * results[i].hotelbaseprice * 1.2
              );
            }

            res.json({ success: true, data: results });
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
              new Date("05/25/2022"),
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
                results[i].hotelbaseprice,
                holidays_count,
                days,
                days - holidays_count
              );
              results[i].hotelbaseprice = Math.trunc(
                results[i].hotelbaseprice *
                  (days - holidays_count + holidays_count * 1.1)
              );
            }
            //res.send(JSON.stringify(results));
            res.json({ success: true, data: results });
          }

          // res.status(200).json({ success: true, data: results });
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

module.exports = router;
