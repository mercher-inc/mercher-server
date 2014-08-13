// Update with your config settings.

module.exports = {

    development: {
        client:     'postgresql',
        connection: {
            database: 'mercher_v2',
            user:     'postgres',
            password: 'postgres'
        },
        pool:       {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    staging: {
        client:     'postgresql',
        connection: {
            database: 'my_db',
            user:     'username',
            password: 'password'
        },
        pool:       {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    production: {
        client:     'postgresql',
        connection: {
            database: 'my_db',
            user:     'username',
            password: 'password'
        },
        pool:       {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations'
        }
    }

};