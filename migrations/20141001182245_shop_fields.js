'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('shop', function (table) {
                table.dropColumn('location');
                table.dropColumn('street_address');
                table.string('street1');
                table.string('street2');
            });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('shop', function (table) {
                table.dropColumn('street1');
                table.dropColumn('street2');
                table.string('location');
                table.string('street_address');
            });
    });
};
