const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String, required: [true, 'Please enter your full name!']
    },
    email: {
        type: String, required: [true, 'Please enter an email!']
        , unique: true, lowercase: true,
        validate: [isEmail, ' Please enter a valid email!']
    },

    password: {
        type: String,
        required: [true, 'Password cannot be blank!'],
        minlength: [6, 'Minimum password length is 6 characters']
    }

}, {
    timestamps: true
});

//fire this before doc save to DB
userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Static method to login user
userSchema.statics.login = async function (email, password) {

    const user = await this.findOne({ email });
    if (user) {
        let isMatched = await bcrypt.compare(password, user.password);
        if (isMatched) {
            return user;
        }

        throw Error('Invalid Credentials')

    }

    throw Error('Invalid Credentials')

}

const User = mongoose.model("user", userSchema);
module.exports = User;
