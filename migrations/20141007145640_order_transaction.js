'use strict';

exports.up = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema
            .createTable('order_transaction', function (table) {
                table.string('id')
                    .primary();
                table.integer('order_id')
                    .notNullable()
                    .references('id')
                    .inTable('order')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                table.json('data');
                table.timestamps();
            });
    });
};

exports.down = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema.dropTable('order_transaction');
    });
};
