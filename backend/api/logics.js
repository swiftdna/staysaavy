const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "database-1.crrtrlvp5oef.us-east-2.rds.amazonaws.com",
    database: "staysaavy",
    port: "3306",
    user: "admin",
    password: "password",
  });

const createRoom = (req, callback) => {
  const { roomtypename, hotel_id, numberofrooms } = req.body;
  try {
    connection.query(
      `SELECT hotelbaseprice from hotel where hotel_id= ?`,
      hotel_id,
      function (error, results) {
        if (error) throw error;
        const { hotelbaseprice } = results[0];
        connection.query(
          `SELECT maxguests,description,cost from room_type where roomtypename= ?`,
          roomtypename,
          function (error1, results1) {
            if (error1) throw error1;
            const { maxguests, description, cost } = results1[0];
            for (let i = 0; i < numberofrooms; i++) {
              connection.query(
                `INSERT INTO room(roomtypename,hotel_id,maxguests,description,roombaseprice) values(?,?,?,?,?)`,
                [
                  roomtypename,
                  hotel_id,
                  maxguests,
                  description,
                  cost * hotelbaseprice,
                ],
                (error2, results2) => {
                  if (error2) throw error2;
                  console.log("values added");
                }
              );
            }
          }
        );

        return callback(null, true);
      }
    );
  } catch (err) {
    return callback(err.message);
  }
}

module.exports = {
    createRoom
};