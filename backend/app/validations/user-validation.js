const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userRegisterSchemaValidation = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
const userLoginSchemaValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
const userUpdateSchemaValidation = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
});

module.exports = {
    userRegisterSchemaValidation,
    userLoginSchemaValidation,
    userUpdateSchemaValidation
};