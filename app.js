'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var mongoose = require('mongoose');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // Mongoose connection, promises and error handling
  mongoose.connect('mongodb://localhost/thougtlog', { useMongoClient: true }); // connection for mongodb
  mongoose.Promise = global.Promise; // Sticking with ES6 promises only
  mongoose.connection.on('error', (err) => {
    console.error(`🚫  🚫  🚫  🚫 ➡ ${err.message}`);
  });

  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
