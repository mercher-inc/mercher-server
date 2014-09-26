'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('image', function (table) {
                table.specificType('main_color', 'CHAR(7)');
            });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('image', function (table) {
                table.dropColumn('main_color');
            });
    });
};
