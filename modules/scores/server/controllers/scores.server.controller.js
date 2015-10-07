'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Score = mongoose.model('Score'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a score
 */
exports.create = function (req, res) {
  var score = new Score(req.body);
  score.user = req.user;

  score.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(score);
    }
  });
};

/**
 * Show the current score
 */
exports.read = function (req, res) {
  res.json(req.score);
};

/**
 * Update a score
 */
exports.update = function (req, res) {
  var score = req.score;

  score.title = req.body.title;
  score.content = req.body.content;

  score.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(score);
    }
  });
};

/**
 * Delete an score
 */
exports.delete = function (req, res) {
  var score = req.score;

  score.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(score);
    }
  });
};

/**
 * List of Scores
 */
exports.list = function (req, res) {
  Score.find().sort('-created').populate('user', 'displayName').exec(function (err, scores) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(scores);
    }
  });
};

/**
 * Score middleware
 */
exports.scoreByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Score is invalid'
    });
  }

  Score.findById(id).populate('user', 'displayName').exec(function (err, score) {
    if (err) {
      return next(err);
    } else if (!score) {
      return res.status(404).send({
        message: 'No score with that identifier has been found'
      });
    }
    req.score = score;
    next();
  });
};
