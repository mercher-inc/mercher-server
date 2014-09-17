'use strict';

exports.up = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('image', function (table) {
                table.specificType('colors', 'CHAR(7)[]');
            });
    });
};

exports.down = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema.table('image', function (table) {
            table.dropColumn('colors')
        });
    });
};
