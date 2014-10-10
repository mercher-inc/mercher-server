var knex = require('knex')({
        client:     'pg',
        connection: {
            host:     process.env['RDS_HOSTNAME'] || 'localhost',
            user:     process.env['RDS_USERNAME'] || 'postgres',
            password: process.env['RDS_PASSWORD'] || 'postgres',
            port:     process.env['RDS_PORT']     || '5432',
            database: process.env['RDS_DB_NAME']  || 'mercher',
            charset:  'utf8'
        },
        migrations: {
            tableName: 'migrations'
        }
    }),
    bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;