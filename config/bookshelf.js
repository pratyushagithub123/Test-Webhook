'use strict';
const knex = require('./knex.config').knex;
const bookshelf = require('bookshelf')(knex);

// Initialize bookshelf once and use it from anywhere
module.exports = bookshelf;