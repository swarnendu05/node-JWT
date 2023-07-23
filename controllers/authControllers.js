const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleErrors = (error) => {
    // console.log(error.message, error.code);
    let errors = { email: '', password: '' };

    //invalid credentials error
    if (error.message === 'Invalid Credentials') {
        errors.email = 'Invalid Login Credentials'
        return errors;
    }

    // Duplicate Error Code
    if (error.code === 11000) {
        errors.email = 'Email is already registered.'
        return errors;
    }

    //Validation Errors
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {

            errors[properties.path] = properties.message
        });

    }
    return errors;

}

const maxAge = 5 * 60 * 1000;
const createToken = (id) => {


    return jwt.sign({ id }, 'This secret key must be saved into a ENV variable', {
        expiresIn: maxAge
    });
}

exports.getHomepage = async (req, res, next) => {
    res.render('index');
}

exports.getSignup = async (req, res, next) => {

    res.render('signup');
}

exports.postSignup = async (req, res, next) => {

    let { name, email, password } = req.body;
    email = email.trim();
    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 100 });

        res.status(201).json({ user: user._id });

    } catch (error) {
        let errors = handleErrors(error);
        res.status(400).json({ errors });

    }

}

exports.getSignin = async (req, res, next) => {

    res.render('signin');

}

exports.postSignin = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
        return res.status(200).json({ user: user._id });


    } catch (error) {
        let errors = handleErrors(error);
        // console.log(error.message);
        res.status(429).json({ errors })
    }
}

exports.getLogOut = async (req, res, next) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

}
