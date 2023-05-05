const express = require("express");
const router = express.Router();
const session = require("express-session");
const mysql = require("mysql");
const util = require("util");
const {pluck, uniq} = require("underscore");

const cors = require("cors");
const { check, validationResult } = require("express-validator");

router.use(cors());
const User = require("../../models/User");
const e = require("express");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const { checkAuth, auth } = require("../../utils/passport");

auth();

let connection = mysql.createConnection({
  host: "database-1.cerbnelrueyi.us-east-1.rds.amazonaws.com",
  database: "staysaavy",
  port: "3306",
  user: "admin",
  password: "password",
});

// insert the records into reservation table once user hits the book button
router.post("/bookrooms", checkAuth, (req, res) => {
  console.log(req.user);
  let cust_email = req.user.cust_email;
  console.log("email", cust_email);
  console.log(req.body);
  let {
    hotel_id,
    booking_date,
    start_date,
    end_date,
    amount,
    numberofguests,
    roomtypename,
  } = req.body;
  try {
    connection.query(
      `select room_id from room where room.hotel_id=? and room.room_id not in (select room_id from reservation where start_date between ? and ? or 
        end_date between ? and ?) and room.roomtypename=? LIMIT 1`,
      [hotel_id, start_date, end_date, start_date, end_date, roomtypename],
      function (error, results) {
        console.log(results);
        if (results && results.length !== 0) {
          let room_id = results[0].room_id;
          console.log(room_id, "room id");
          connection.query(
            `INSERT INTO reservation(hotel_id,cust_email,room_id,roomtypename,booking_date,start_date,end_date,amount,numberofguests) values(?,?,?,?,?,?,?,?,?)`,
            [
              hotel_id,
              cust_email,
              room_id,
              roomtypename,
              booking_date,
              start_date,
              end_date,
              amount,
              numberofguests,
            ],
            function (error1, results1) {
              if (error1) {
                console.log(error1);
                res.send("failure");
              } else {
                let rewardpoints = Math.trunc(0.01 * amount);
                console.log("rewardpoint", rewardpoints);
                connection.query(
                  `UPDATE customer set reward_points=(reward_points+?) where cust_email =?`,
                  [rewardpoints, cust_email],
                  function (error3, results3) {
                    if (error3) {
                      res.send("failure");
                    }
                 else {
                connection.query(
                  `SELECT reward_points from customer where cust_email =?`,
                  [cust_email],
                  function (error2, results2) {
                    if (error2) {
                      res.send("failure");
                    } else {
                      if (results2) {
                        let reward_points = results2[0].reward_points;
                        if (reward_points > 100) {
                          const customer_type = "gold";
                          connection.query(
                            `UPDATE customer set customer_type=? where cust_email =?`,
                            [customer_type, cust_email],
                            function (error4, results4) {
                              if (error4) {
                                res.send("failure");
                              }
                              else {
                                res.json({success: true});
                              }
                            }
                          );
                        }
                        if (reward_points > 50 && reward_points <= 100) {
                          const customer_type = "silver";
                          connection.query(
                            `UPDATE customer set customer_type=? where cust_email =?`,
                            [customer_type, cust_email],
                            function (error5, results5) {
                              if (error5) {
                                res.send("failure");
                              }
                              else{
                                res.json({success: true});
                              }
                            }
                          );
                        }
                        if (reward_points <=50) {
                          res.json({success: true});
                        }
                      } else {
                        res.send("failure");
                      }
                    }
                  }
                );
              }
            }
                )
            }
            }
          );
          
        } else {
          res.send({success: false, message: "hw server error"});
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

router.get("/getmybookings", checkAuth, async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    //res.send(errors.code);
    return res.status(500).json({ errors: errors.array() });
  }
  console.log(req.user);

  const cust_email = req.user.cust_email;
  const dbQuery = util.promisify(connection.query).bind(connection);
  try {
    const results = await dbQuery(`select * from reservation where cust_email=? order by reservation_id DESC`, [cust_email]);
    const rawHotelIDs = pluck(results, 'hotel_id');
    const hotelIDs = uniq(rawHotelIDs);
    const hotelsMap = {};
    if (hotelIDs && hotelIDs.length) {
      const hotelDetails = await dbQuery(`select * from hotel where hotel_id IN (?)`, [hotelIDs]);
      hotelDetails.map(hotel => {
        hotelsMap[hotel.hotel_id] = hotel;
      });
    }
    results.map(result => {
      result.hotel = hotelsMap[result.hotel_id];
    })
    if (results && results.length !== 0) {
      res.json({ success: true, data: results });
    } else {
      res.json({ success: true, message: "failure"});
    }
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

// check room availability to modify the user booking
router.post("/checkmodificationavailability", checkAuth, async (req, res) => {
  const { hotel_id, start_date, end_date, roomtypename, numberofguests } =
    req.body;
  console.log(req.user);
  let summer_start_date = new Date("05/01/2023");
  let summer_end_date = new Date("05/31/2023");
  let christmas_start_date = new Date("12/20/2022");
  let christmas_end_date = new Date("01/10/2023");
  let customer_type = req.user.customer_type;
  let customer_loyalty_discount = 1;
  if (customer_type == "gold") {
    customer_loyalty_discount = 0.8;
  }
  if (customer_type == "silver") {
    customer_loyalty_discount = 0.9;
  }
  let res_start_date = new Date(start_date);
  let res_end_date = new Date(end_date);
  let totalHolidays = 0;
  let guestincrementcost = 1;
  if (numberofguests == 2) {
    guestincrementcost = 0.7;
  }
  if (numberofguests == 3) {
    guestincrementcost = 0.55;
  }
  if (numberofguests == 4) {
    guestincrementcost = 0.45;
  }
  try {
    connection.query(
      `select room_id,roombaseprice from room where room.hotel_id=? and room.room_id not in (select room_id from reservation where start_date between ? and ? or 
                end_date between ? and ?) and room.roomtypename=? LIMIT 1`,
      [hotel_id, start_date, end_date, start_date, end_date, roomtypename],
      function (error, results) {
        console.log(results);
        if (results && results.length !== 0) {
          let room_id = results[0].room_id;
          let roombaseprice = results[0].roombaseprice;
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
            roombaseprice = Math.trunc(
              customer_loyalty_discount *
                days *
                roombaseprice *
                1.2 *
                numberofguests *
                guestincrementcost
            );
            res.json({ room_id, roombaseprice });
          } else {
            let mod = days % 7;
            let full_weeks = (days - mod) / 7;

            let totalHolidays = full_weeks * 2;
            console.log(
              "mod,full_weeks,weekend_days",
              mod,
              full_weeks,
              totalHolidays
            );

            if (mod != 0) {
              // iterate through remainder days
              let startPartialWeek = new Date();
              let endPartialWeek = res_end_date;
              console.log("endpartialweek", endPartialWeek);
              startPartialWeek.setTime(
                res_end_date.getTime() - (mod - 1) * ms_per_day
              );
              console.log("startpartialweek", startPartialWeek);
              for (
                var d = startPartialWeek;
                d <= endPartialWeek;
                d.setDate(d.getDate() + 1)
              ) {
                if (d.getDay() == 0 || d.getDay() == 6) {
                  totalHolidays++;
                  console.log(
                    "in final",
                    d.getDate(),
                    "get the day",
                    d.getDay(),
                    "days count",
                    totalHolidays
                  );
                }
              }
            }

            console.log("weekend count", totalHolidays);

            let holidays = [
              new Date("06/03/2022"),
              new Date("06/20/2022"),
              new Date("04/02/2022"),
            ];
            for (let i = 0; i < holidays.length; i++) {
              console.log(holidays[i].toDateString());
              console.log(holidays[i]);

              let d = holidays[i].getDay(); //Make sure holiday is not a weekendday!
              console.log("get day", d);
              if (
                holidays[i] >= res_start_date &&
                holidays[i] <= res_end_date &&
                !(d == 0 || d == 6)
              ) {
                //console.log("in if loop")
                totalHolidays = totalHolidays + 1;
              }
            }
            console.log("total actual holidays", totalHolidays);
            console.log(
              roombaseprice,
              customer_loyalty_discount,
              totalHolidays,
              days,
              days - totalHolidays
            );
            //roombaseprice = customer_loyalty_discount * roombaseprice * ((days-totalHolidays)+ (totalHolidays * 1.1))
            roombaseprice = Math.trunc(
              customer_loyalty_discount *
                roombaseprice *
                numberofguests *
                guestincrementcost *
                (days - totalHolidays + totalHolidays * 1.2)
            );
            console.log(roombaseprice);

            res.json({
              success: true, 
              data: {
                room_id, roombaseprice
              } 
            });
          }
        } else {
          res.json({success: false, message: "rooms are not available for the selected dates"});
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

// modifying the reservation
router.post("/modifybooking", checkAuth, async (req, res) => {
  let cust_email = req.user.cust_email;
  console.log(req.body);
  const {
    reservation_id,
    room_id,
    booking_date,
    start_date,
    end_date,
    amount,
  } = req.body;
  try {
    connection.query(
      `Select amount from reservation where reservation_id = ?`,
      [reservation_id],function(error1,results1)
      { 
        if (error1){
          res.send("failure");
        } 
        else{
          if (results1){
    connection.query(
      `UPDATE reservation set room_id=?, booking_date=?, start_date=?, end_date=?, amount=? where reservation_id=?`,
      [room_id, booking_date, start_date, end_date, amount, reservation_id],
      function (error, results) {
        //console.log(results);
        if (error) {
          res.send("failure");
        } else {
          let rewardpoints = Math.trunc((0.01 * req.body.amount)- (0.01 * results1[0].amount) ) ;
          console.log("rewardpoint", rewardpoints);
          connection.query(
            `UPDATE customer set reward_points=(reward_points+(?)) where cust_email =?`,
            [rewardpoints, cust_email],
            function (error3, results3) {
              if (error3) {
                res.send("failure");
              }
           else {
          connection.query(
            `SELECT reward_points from customer where cust_email =?`,
            [cust_email],
            function (error2, results2) {
              if (error2) {
                res.send("failure");
              } else {
                if (results2) {
                  let reward_points = results2[0].reward_points;
                  if (reward_points > 100) {
                    const customer_type = "gold";
                    connection.query(
                      `UPDATE customer set customer_type=? where cust_email =?`,
                      [customer_type, cust_email],
                      function (error4, results4) {
                        if (error4) {
                          res.send("failure");
                        }
                        else {
                          res.json({success: true});
                        }
                      }
                    );
                  }
                  if (reward_points <= 50 ) {
                    const customer_type = "bronze";
                    connection.query(
                      `UPDATE customer set customer_type=? where cust_email =?`,
                      [customer_type, cust_email],
                      function (error6, results6) {
                        if (error6) {
                          res.send("failure");
                        }
                        else {
                          res.json({success: true});
                        }
                      }
                    );
                  }
                  if (reward_points > 50 && reward_points <= 100) {
                    const customer_type = "silver";
                    connection.query(
                      `UPDATE customer set customer_type=? where cust_email =?`,
                      [customer_type, cust_email],
                      function (error5, results5) {
                        if (error5) {
                          res.send("failure");
                        }
                        else{
                          res.json({success: true});
                        }
                      }
                    );
                  }
                } else {
                  res.send("failure");
                }
              }
            }
          );
        }
      }
          )
        }
      }
    );}
    else{
      res.send("failure");
    }
        }
      })
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

  
router.post("/cancelbooking", checkAuth, async (req, res) => {
  let cust_email = req.user.cust_email;
  console.log(req.body);
  const { reservation_id } = req.body;
  try {
    connection.query(
      `Select amount from reservation where reservation_id = ?`,
      [reservation_id],function(error1,results1)
      { 
        if (error1){
          res.send("failure");
        } 
        else {
          if(results1)
          {
    connection.query(
      `Delete from reservation where reservation_id = ?`,
      [reservation_id],
      function (error, results) {
        //console.log(results);
        if (error) {
          res.send("failure");
        } else {
          let rewardpoints = Math.trunc(0.01 * results1[0].amount);
          console.log("rewardpoint", rewardpoints);
          connection.query(
            `UPDATE customer set reward_points=(reward_points-?) where cust_email =?`,
            [rewardpoints, cust_email],
            function (error3, results3) {
              if (error3) {
                res.send("failure");
              }
           else {
          connection.query(
            `SELECT reward_points from customer where cust_email =?`,
            [cust_email],
            function (error2, results2) {
              if (error2) {
                res.send("failure");
              } else {
                if (results2) {
                  let reward_points = results2[0].reward_points;
                  if (reward_points > 100) {
                    const customer_type = "gold";
                    connection.query(
                      `UPDATE customer set customer_type=? where cust_email =?`,
                      [customer_type, cust_email],
                      function (error4, results4) {
                        if (error4) {
                          res.send("failure");
                        }
                        else {
                          res.json({success: true});
                        }
                      }
                    );
                  }
                  if (reward_points <= 50 ) {
                    const customer_type = "bronze";
                    connection.query(
                      `UPDATE customer set customer_type=? where cust_email =?`,
                      [customer_type, cust_email],
                      function (error6, results6) {
                        if (error6) {
                          res.send("failure");
                        }
                        else {
                          res.json({success: true});
                        }
                      }
                    );
                  }
                  if (reward_points > 50 && reward_points <= 100) {
                    const customer_type = "silver";
                    connection.query(
                      `UPDATE customer set customer_type=? where cust_email =?`,
                      [customer_type, cust_email],
                      function (error5, results5) {
                        if (error5) {
                          res.send("failure");
                        }
                        else{
                          res.json({success: true});
                        }
                      }
                    );
                  }
                } else {
                  res.send("failure");
                }
              }
            }
          );
        }
      }
          )
        }
      }
    )}else {
      res.send("failure");
    }}})
  } catch (err) {
    console.error(err.message);
    res.send("server error");
  }
});

module.exports = router;
