'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var app = require('express')();
// All the variables defined in some.env file will be acccessible as proces.env.SOME_VARIABLE
// Please put any configuration variables in configuration.env.sample
var dotenv = require('dotenv').config({ path: 'configuration.env' });
var mongoose = require('mongoose');
var UAParser = require('ua-parser-js');
var { User } = require('./api/models/user_model');

module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    Bearer: function (req, authOrSecDef, token, callback) {
      if (token) {
        User.findByToken(token)
          .then((user) => {
            console.log(user);
            if(!user) {
              var err = new Error('No User found with the given token');
              err['statusCode'] = 404;
              callback(err);
            }
            req.swagger.params.auth_payload = user._id;
            callback();
          }).catch(() => {
            var err = new Error('Failed to authenticate using bearer token');
            err['statusCode'] = 401;
            callback(err);
          })
      } else {
        var err = new Error('Failed to authenticate using bearer token');
        err['statusCode'] = 401;
        callback(err);
      }
    }
  }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {

  if (err) { throw err; }
  // Mongoose connection, promises and error handling
  mongoose.connect(process.env.DATABASE, { useMongoClient: true }); // connection for mongodb
  mongoose.Promise = global.Promise; // Sticking with ES6 promises only
  mongoose.connection.on('error', (err) => {
    console.error(`🚫  🚫  🚫  🚫 ➡ ${err.message}`);
  });

  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }

});
