var knex = require('knex')({
        client:     'pg',
        connection: {
            host:     process.env.RDS_HOSTNAME,
            user:     process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            port:     process.env.RDS_PORT,
            database: process.env.RDS_DB_NAME,
            charset:  'utf8'
        },
        migrations: {
            tableName: 'migrations'
        }
    }),
    bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;