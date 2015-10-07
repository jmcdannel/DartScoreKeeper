'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Score = mongoose.model('Score'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, score;

/**
 * Score routes tests
 */
describe('Score CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new score
    user.save(function () {
      score = {
        title: 'Score Title',
        content: 'Score Content'
      };

      done();
    });
  });

  it('should be able to save an score if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new score
        agent.post('/api/scores')
          .send(score)
          .expect(200)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Handle score save error
            if (scoreSaveErr) {
              return done(scoreSaveErr);
            }

            // Get a list of scores
            agent.get('/api/scores')
              .end(function (scoresGetErr, scoresGetRes) {
                // Handle score save error
                if (scoresGetErr) {
                  return done(scoresGetErr);
                }

                // Get scores list
                var scores = scoresGetRes.body;

                // Set assertions
                (scores[0].user._id).should.equal(userId);
                (scores[0].title).should.match('Score Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an score if not logged in', function (done) {
    agent.post('/api/scores')
      .send(score)
      .expect(403)
      .end(function (scoreSaveErr, scoreSaveRes) {
        // Call the assertion callback
        done(scoreSaveErr);
      });
  });

  it('should not be able to save an score if no title is provided', function (done) {
    // Invalidate title field
    score.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new score
        agent.post('/api/scores')
          .send(score)
          .expect(400)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Set message assertion
            (scoreSaveRes.body.message).should.match('Title cannot be blank');

            // Handle score save error
            done(scoreSaveErr);
          });
      });
  });

  it('should be able to update an score if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new score
        agent.post('/api/scores')
          .send(score)
          .expect(200)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Handle score save error
            if (scoreSaveErr) {
              return done(scoreSaveErr);
            }

            // Update score title
            score.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing score
            agent.put('/api/scores/' + scoreSaveRes.body._id)
              .send(score)
              .expect(200)
              .end(function (scoreUpdateErr, scoreUpdateRes) {
                // Handle score update error
                if (scoreUpdateErr) {
                  return done(scoreUpdateErr);
                }

                // Set assertions
                (scoreUpdateRes.body._id).should.equal(scoreSaveRes.body._id);
                (scoreUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of scores if not signed in', function (done) {
    // Create new score model instance
    var scoreObj = new Score(score);

    // Save the score
    scoreObj.save(function () {
      // Request scores
      request(app).get('/api/scores')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single score if not signed in', function (done) {
    // Create new score model instance
    var scoreObj = new Score(score);

    // Save the score
    scoreObj.save(function () {
      request(app).get('/api/scores/' + scoreObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', score.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single score with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/scores/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Score is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single score which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent score
    request(app).get('/api/scores/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No score with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an score if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new score
        agent.post('/api/scores')
          .send(score)
          .expect(200)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Handle score save error
            if (scoreSaveErr) {
              return done(scoreSaveErr);
            }

            // Delete an existing score
            agent.delete('/api/scores/' + scoreSaveRes.body._id)
              .send(score)
              .expect(200)
              .end(function (scoreDeleteErr, scoreDeleteRes) {
                // Handle score error error
                if (scoreDeleteErr) {
                  return done(scoreDeleteErr);
                }

                // Set assertions
                (scoreDeleteRes.body._id).should.equal(scoreSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an score if not signed in', function (done) {
    // Set score user
    score.user = user;

    // Create new score model instance
    var scoreObj = new Score(score);

    // Save the score
    scoreObj.save(function () {
      // Try deleting score
      request(app).delete('/api/scores/' + scoreObj._id)
        .expect(403)
        .end(function (scoreDeleteErr, scoreDeleteRes) {
          // Set message assertion
          (scoreDeleteRes.body.message).should.match('User is not authorized');

          // Handle score error error
          done(scoreDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Score.remove().exec(done);
    });
  });
});
