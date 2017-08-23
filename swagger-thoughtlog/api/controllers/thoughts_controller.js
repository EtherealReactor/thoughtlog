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

const showThought = (req, res, next) => {
  var id = req.query.id
  Thought.find({_id: req.swagger.params.id.value})
    .then((thought) => {
      if(thought.length > 0) {
        res.status(200).send(_.pick(thought[0], ['_id', 'description', 'status', 'updated_at']))
      }
      res.status(404).send({ errors: ['Valid Id. But no thought found for the given Id'] })
    }).catch((err) => {
      res.status(400).send({errors: err.toString().replace('MongooseError: ', '').split(',')})
    })
};

const removeThought = (req, res, next) => {
  Thought.findOneAndUpdate({ _id: req.swagger.params.id.value }, { status: 'deleted' }, { new: true })
    .then((thought) => {
      if(thought) {
        res.status(200).send(_.pick(thought, ['_id', 'description', 'status', 'updated_at']))
      }
      res.status(404).send({ errors: ['No thought found for the given Id'] })
    }).catch((err) => {
      res.send(400).send({errors: []})
    });
}

const updateThought = (req, res, next) => {
  Thought.findOneAndUpdate({ _id: req.swagger.params.id.value }, req.body, { new: true, runValidators: true })
    .then((thought) => {
      if(thought) {
        res.status(200).send(_.pick(thought, ['_id', 'description', 'status', 'updated_at']))
      }
      res.status(404).send({ errors: ['No thought found for the given Id'] })
    }).catch((err) => {
      const messages = err.toString().replace('ValidationError: ', '').split(',');
      res.status(400).send({ errors: messages });
    });
}

module.exports = { createThought, fetchAllThoughts, showThought, removeThought, updateThought };
