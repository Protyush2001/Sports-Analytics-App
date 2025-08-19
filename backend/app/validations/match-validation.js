const Joi = require('joi');

const matchSchemaValidation = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    date: Joi.date().required(),
    location: Joi.string().required(),
    teams: Joi.array().items(Joi.string().required()).min(2).required(),
    status: Joi.string().valid('scheduled', 'ongoing', 'completed').required(),
    score: Joi.string().optional(),
    dateTime: Joi.date().required(),
    type: Joi.string().valid('cricket').required(),
});

module.exports = matchSchemaValidation;
