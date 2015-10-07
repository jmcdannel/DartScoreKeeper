'use strict';

/**
 * Module dependencies.
 */
var scoresPolicy = require('../policies/scores.server.policy'),
  scores = require('../controllers/scores.server.controller');

module.exports = function (app) {
  // Scores collection routes
  app.route('/api/scores').all(scoresPolicy.isAllowed)
    .get(scores.list)
    .post(scores.create);

  // Single score routes
  app.route('/api/scores/:scoreId').all(scoresPolicy.isAllowed)
    .get(scores.read)
    .put(scores.update)
    .delete(scores.delete);

  // Finish by binding the score middleware
  app.param('scoreId', scores.scoreByID);
};
