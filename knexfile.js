module.exports = {
    development: {
        client:     'pg',
        connection: {
            host:     '127.0.0.1',
            user:     'postgres',
            password: 'postgres',
            database: 'mercher',
            charset:  'utf8',
            port:     5432
        },
        migrations: {
            tableName: 'migrations'
        }
    },
    production: {
        client:     'pg',
        connection: {
            host:     process.env.RDS_HOSTNAME,
            user:     process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            port:     process.env.RDS_PORT,
            database: 'mercher',
            charset:  'utf8'
        },
        migrations: {
            tableName: 'migrations'
        }
    }
};
