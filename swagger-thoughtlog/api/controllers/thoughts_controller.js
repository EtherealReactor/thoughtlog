'use strict';

var { Thought } = require('../models/thought_model');
var _ = require('lodash');

const createThought = (req, res, next) => {
  var thought = new Thought(req.body);
  thought.save()
    .then((thought_obj) => {
      // using lodash pick method to fetch only necessary fields
      res.status(200).send(_.pick(thought_obj, ['_id', 'description', 'status', 'updated_at']));
    }).catch((err) => {
      console.log('errors', err);
      const messages = err.toString().replace('ValidationError: ', '').split(',');
      res.status(400).send({ errors: messages });
    });
};

const fetchAllThoughts = (req, res, next) => {
  var page = req.query.page || 1;
  var limit = +(req.query.limit) || 10;
  Thought.paginate({}, { page: page, limit: limit })
    .then((result) => {
      var docs = _.map(result.docs, function(o) { return _.pick(o, ['_id', 'description', 'status', 'updated_at']); });
      res.status(200).send({thoughts: docs, all_thoughts: result.total, current_page: +(result.page), total_pages: result.pages, limit: result.limit })
    }).catch((err) => {
      res.status(400).send({ errors: err.toString().replace('MongoError: ', '').split('.')})
  });
}

module.exports = { createThought, fetchAllThoughts };
