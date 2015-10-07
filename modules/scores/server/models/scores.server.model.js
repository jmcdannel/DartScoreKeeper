'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Score Schema
 */
var ScoreSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  game: {
    type: String,
    default: '',
    trim: true,
    required: 'Game cannot be blank'
  },
  player: {
    type: String,
    default: '',
    trim: true,
    required: 'Player cannot be blank'
  },
  score: {
    type: String,
    default: '',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Score', ScoreSchema);
