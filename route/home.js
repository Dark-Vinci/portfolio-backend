const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('config');

const router = express.Router();

const { Admin, validate, validateLogin } = require('../model/admin');
const { Message, validateMessage } = require('../model/message');
const { validateFood, Food } = require('../model/food');

const wrapper = require('../middleware/wrapper');
const auth = require('../middleware/auth');
const bodyValidator = require('../middleware/bodyValidator');


router.post('/register-admin', bodyValidator(validate), wrapper ( async ( req, res ) => {
    const admins = await Admin.find().count();

    if (admins.length >=1) {
        return res.status(400).json({
            status: 400,
            message: 'we cant have more than one admin'
        });
    } else {
        let { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        
        const admin = new Admin({ username, email, password });

        await admin.save();

        const token = admin.generateAuthToken();
        const toReturn = _.pick(admin, ['username', 'email', '_id']);
        toReturn.expiresIn = config.get('expiresIn');

        res.status(201).header('x-auth-token', token).json({
            status: 201,
            message: 'success',
            data: toReturn
        });
    }
}));

router.post('/login', bodyValidator(validateLogin), wrapper ( async ( req, res ) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if(!admin) {
        return res.status(404).json({
            status: 404,
            message: 'invalid email or password'
        });
    } else {
        const isValid = await bcrypt.confirm(password, admin.password);

        if (!isValid) {
            return res.status(404).json({
                status: 404,
                message: 'invalid email or password'
            });
        } else {
            const token = admin.generateAuthToken();
            const toReturn = _.pick(admin, ['username', 'email', '_id']);

            res.status(200).header('x-auth-token', token).json({
                status: 200,
                message: 'success',
                data: toReturn
            });
        }
    }
}));

router.post('/message', bodyValidator(validateMessage), wrapper ( async ( req, res ) => {
    const { email, text } = req.body;

    const message = new Message({ email, text });
    await message.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: 'submitted'
    });
}));

router.post('/create-food', bodyValidator(validateFood), wrapper ( async (req, res) => {
    const { url, price, star, title } = req.body;

    const food = new Food({ url, price, star, title });

    await food.save();

    res.status(201).json({ 
        status: 201,
        message: 'message',
        data: food
    });
}));

router.get('/get-food', wrapper ( async (req, res) => {
    const food = await Food.find();

    console.log(food.length);
    res.status(200).json({
        status: 200,
        message: 'success',
        data: food
    });
}));

router.get('/get-message', wrapper ( async ( req, res ) => {
    const messages = await Message.find()
        .sort({ createdAt: -1 });

    if (messages.length == 0) {
        return res.status(404).json({
            status: 404,
            message: 'you do not have any messages yet'
        });
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: messages
        })
    }
}));

module.exports = router;