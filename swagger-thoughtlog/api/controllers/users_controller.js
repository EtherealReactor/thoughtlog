'use strict'; // Please always write code in strict mode

var bcrypt = require('bcryptjs');
var Utilities = require('./../helpers/utilities');

// import user model
var { User } = require('../models/user_model');

const signup = (req, res, next) => {
  var user = new User(req.body)
  // generateAuthToken and then save the user
  user.generateAuthToken(req)
    .then((token) => {
      console.log('user done', token);
      res.header('token', token).status(200).send({ message: 'User created successfully', token: token })
    }).catch((err) => {
      const messages = err.toString().replace('ValidationError: ', '').split(',');
      res.status(400).send({ message: messages });
    });
};

const profile = (req, res, next) => {
  // swaggerSecurityHandlers will automatically set the user_id in params :)
  const _id = req.swagger.params.auth_payload;

  User.findOne({_id: _id})
    .then((user) => {
      if(!user) {
        res.status(404).send(['No User found. Please login again to retrive user details'])
      }
      res.status(200).send({_id: user._id, email: user.email, username: user.username})
    }).catch((err) => {
      res.status(400).send(err);
    })
};

const signin = (req, res, next) => {
  const {email, password} = req.body;
  User.findByCredentials(email, password, req)
    .then(({user, token}) => {
      console.log('user loggged in successfully', user);
      console.log('platofom token', token);
      res.status(200).send({_id: user._id, email: user.email, username: user.username, token: token})
    }).catch((err) => {
      res.status(400).send({message: [err]});
    })
};

const logout = (req, res, next) => {
  User.logout(req.headers.authorization)
    .then((user) => {
      console.log('user after token removal', user);
      req.swagger.params.auth_payload = null;
      res.status(200).send({message: 'User logged out successfully.'});
    }).catch((err) => {
      res.status(400).send(err);
    })
};

module.exports = { signup, profile, signin, logout }
