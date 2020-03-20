const express = require('express');
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

server.use(express.json());

server.use(helmet());

// server.use(morgan('dev'));
server.use(logger);

server.use('/api/user', userRouter);
server.use('/api/post', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const { method, url } = req;
  console.log(JSON.stringify({method, url, timestamp: Date.now()}));
  next();
}

function errorHandler(error, req, res, next) {
  console.log('error: ', error.message);
  res.status(400).json({ message: error.message });
}

server.use(errorHandler);

module.exports = server;
