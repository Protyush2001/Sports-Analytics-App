const Joi = require('joi');

const customMatchValidationSchema = Joi.object({
  title: Joi.string().required(),
  teams: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      players: Joi.array().items(Joi.string())
    })
  ).required(),
  overs: Joi.number().min(1).default(20),
  currentScore: Joi.object({
    team: Joi.string().required(),
    runs: Joi.number().min(0).default(0),
    wickets: Joi.number().min(0).default(0),
    overs: Joi.number().min(0).default(0),
    balls: Joi.number().min(0).default(0)
  }).required(),
  status: Joi.string().valid("Upcoming", "Live", "Completed").default("Upcoming"),
  createdBy: Joi.string().required(),
  date: Joi.date().default(Date.now)
});

module.exports = customMatchValidationSchema;
