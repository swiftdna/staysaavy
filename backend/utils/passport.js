"use strict";
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
var { secret } = require('./config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'database-1.cerbnelrueyi.us-east-1.rds.amazonaws.com',
    database: 'staysaavy',
    port: '3306',
    user: 'admin',
    password: 'password',
});

connection.connect((err) => {
    if (err) {
        throw 'Error occured ' + err;
    }
    console.log("pool created");
});


function auth() {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };
    passport.use(new JwtStrategy(opts, (jwt_payload, callback) => {
        const cust_email = jwt_payload.cust_email
        connection.query(`SELECT * FROM customer WHERE cust_email=?`, [cust_email
        ], function (error, results) {
            if (error) {
                console.log("Invalid user from server");
                return callback(error, false)
            }
            if (results && results.length !== 0) {
                console.log("Valid user");
                callback(null, results);
            }
            else {
                console.log("InValid user");
                callback(null, results);
            }
        });
    }))
}


exports.auth = auth;
exports.checkAuth = (req, res, next) => {
    const { nc_token } = req.cookies;
    req.headers.authorization = `Bearer ${nc_token}`;
    return passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (process.env.NODE_ENV === 'test') {
            // for testing only
            return next();
        }
        if (user && user.length) {
            req.user = user[0];
            return next();
        }
        res.status(401).json({ message: "Not authorized to see this page. Please login!", status: 401 });
    })(req, res, next);
};