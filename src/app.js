// src/app.js

// # Importing required libraries and files!

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const logger = require('./logger');
const pino = require('pino-http')({ logger });

const passport = require('passport');
const authenticate = require('./auth');

const app = express();

// # Middlewares

app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

// ## Setting up the passport authentication middleware!
passport.use(authenticate.strategy());
app.use(passport.initialize());

app.use('/', require('./routes'));

// ## Error handling middleware!
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Using the status and message from the error object if it is there, otherwise using a generic server error status and message!
  const status = err.status || 500,
    message = err.message || 'Unable to process the request!';

  // Logging something specific so we know if there is any server error!
  if (status > 499) logger.error({ err }, 'Error processing request!');

  res.status(status).json({ status: 'Error!', error: { message, code: status } });
});

const { version, author } = require('../package.json');

// Define the route handler for GET /health
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: version,
    author: author,
    githubUrl: 'https://github.com/rutarj/fragments',
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      code: 404,
      message: 'not found',
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;
