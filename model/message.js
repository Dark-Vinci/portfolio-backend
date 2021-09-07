const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Joi = require('joi');

const messageSchema = new Schema ({
    email: {
        type: String,
        trim: true,
        minlength: 5,
        required: true
    },

    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

function validateMessage (input) {
    const schema = Joi.object({
        text: Joi.string()
            .min(1)
            .required(),

        email: Joi.string()
            .email()
            .required()
    });

    const result = schema.validate(input);
    return result;
}

module.exports = { Message, validateMessage };