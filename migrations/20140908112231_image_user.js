'use strict';

exports.up = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('image', function (table) {
                table.integer('user_id')
                    .references('id')
                    .inTable('user')
                    .onDelete('RESTRICT')
                    .onUpdate('CASCADE');
            });
    });
};

exports.down = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema.table('image', function (table) {
            table.dropColumn('user_id')
        });
    });
};
