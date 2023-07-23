const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.verifyAuth = async (req, res, next) => {

    const token = req.cookies.jwt;


    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, Decodedtoken) => {
            if (error) {
                res.redirect('/signin');
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect('/signin');
    }
}

//Checking the current logged in user
exports.checkUser = async (req, res, next) => {

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'This secret key must be saved into a ENV variable', async (error, Decodedtoken) => {

            if (error) {
                res.locals.loggedUser = null;
                return next(error, false);
            }
            if (Decodedtoken) {
                let user = await User.findById(Decodedtoken.id);
                req.user = user;
                res.locals.loggedUser = user.email;

                return next();
            }
        })
    }
    else {
        res.locals.loggedUser = null;
        return next();
    }

}