'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema
                .table('shop', function (table) {
                    table.string('subtitle');
                }),
            trx.schema
                .table('product', function (table) {
                    table.string('subtitle');
                })
        ]);
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema
                .table('shop', function (table) {
                    table.dropColumn('subtitle');
                }),
            trx.schema
                .table('product', function (table) {
                    table.dropColumn('subtitle');
                })
        ]);
    });
};
