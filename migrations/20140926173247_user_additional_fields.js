'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.raw('CREATE TYPE "user_gender" AS ENUM (\'female\', \'male\')')
        ]).then(function () {
            return trx.schema
                .table('user', function (table) {
                    table.specificType('gender', 'user_gender');
                });
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('user', function (table) {
                table.dropColumn('gender');
            })
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "user_gender"')
                ]);
            });
    });
};
