var knexfile = require('../knexfile'),
    knex = require('knex')(knexfile.development),
    bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;