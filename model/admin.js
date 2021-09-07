const mongoose = require('mongoose');
const {  Schema } = require('mongoose');
const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 1024
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 30
    }, 

    userVisited: {
        type: [ Date ]
    }
});

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ 
        isAdmin: true, 
        _id: this._id 
    }, config.get('jwtPassword'), {
        expiresIn: config.get('expiresIn')
    });

    return token;
}

const Admin = mongoose.model('Admin', adminSchema);

function validate (input) {
    const schema = Joi.object({
        username: Joi.string()
            .required()
            .min(1)
            .max(30),

        password: Joi.string()
            .required()
            .min(6)
            .max(30),

        email: Joi.string()
            .required()
            .email()
    });

    const result = schema.validate(input);
    return result;
}

function validateLogin (input) {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(6)
            .max(30),

        email: Joi.string()
            .required()
            .email()
    });

    const result = schema.validate(input);
    return result;
}

module.exports = { Admin, validate, validateLogin }
