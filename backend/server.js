const express = require('express');
const session = require('express-session');
const app = express();
var mysql = require('mysql');
//const passport    = require('passport');
var cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
//var constraints = require("./config.json");

app.use(cookieParser());
app.use(cors());

app.use(session({
     secret: 'mysql',
     resave: false,
     saveUninitialized: false,
     duration: 60 * 60 * 1000,
     activeDuration: 5 * 60 * 1000
 }));
 

/*
var connection = mysql.createPool({
    host: constraints.DB.host,
    user:constraints.DB.username,
    password: constraints.DB.password,
    port: constraints.DB.port,
    database: constraints.DB.database
});
*/
NINJACOUCH = {};
const connection = mysql.createConnection({
    host: 'database-1.crrtrlvp5oef.us-east-2.rds.amazonaws.com',
    database: 'staysaavy',
    port: '3306',
    user: 'admin',
    password: 'password',
});

connection.connect((err) => {
    if(err){
        throw 'Error occured ' + err.message;
    }
    NINJACOUCH.db = connection;
    console.log("MySQL connection successful");
});

app.use(express.static(__dirname + '/public'));


app.get('/test_api',async function(req,res){
    await connection.query('SELECT * from users', async function(error,results){
        if(error){
            res.writeHead(200, {
                'Content-Type': 'text-plain'
            });
            res.send(error.code);
        }else{
            res.writeHead(200,{
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(results));
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(()=>{
        // destroy session data
        req.session = null;
        res.clearCookie("nc_token");
        res.json({success: true});
    });
});

// app.post('/create',async function(req,res){
//     await connection.query(`Insert into test_table(uname,email,password)values(?,?,?)`,[req.body.uname,
//         request.body.email,request.body.password], async function(error,results){
//         if(error){
//             res.writeHead(200, {
//                 'Content-Type': 'text-plain'
//             });
//             res.send(error.code);
//         }else{
//             res.writeHead(200,{
//                 'Content-Type': 'text/plain'
//             });
//             res.end(JSON.stringify(results));
//         }
//     });
//     res.send(req.body);
// });

app.use('/api/v1', routes);
//Defining Routes
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));
//app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/hotel', require('./api/hotel'));
app.use('/api/admin', require('./api/admin'));
app.use('/api/rooms', require('./api/rooms'));
//app.use('/api/bookings', require('./routes/api/bookings'));
app.use('/api/reservation', require('./api/reservation'));
//app.use('/api/restaurant', require('./routes/api/restaurant'));

app.get('*', function (req, res) {
    res.sendFile(`${__dirname}/public/index.html`, (err) => {
      if (err) {
        console.log(err);
        res.end(err.message);
      }
    });
  });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;