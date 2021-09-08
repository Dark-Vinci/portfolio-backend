const { model } = require('mongoose');
const { Schema } = require('mongoose');
const Joi = require('joi');

const foodSchema = new Schema ({
    url: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    title: {
        type: String,
        required: true,
        minlength: 5
    },

    price: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    }
});

const Food = model('Food', foodSchema);

function validateFood (input) {
    const schema = Joi.object({
        price: Joi.number()
            .integer()
            .required()
            .min(1)
            .max(50),

        title: Joi.string()
            .required()
            .min(2)
            .max(20),

        star: Joi.number()
            .integer()
            .required()
            .min(1)
            .max(5) ,

        url: Joi.string()
            .required()
    });

    const result = schema.validate(input);
    return result;
}

module.exports = { validateFood, Food }