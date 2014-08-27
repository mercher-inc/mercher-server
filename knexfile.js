module.exports = {
    development: {
        client:     'pg',
        connection: {
            host:     'localhost',
            user:     'postgres',
            password: 'postgres',
            database: 'mercher',
            charset:  'utf8',
            port:     5432
        },
        migrations: {
            tableName: 'migrations'
        }
    }
};
