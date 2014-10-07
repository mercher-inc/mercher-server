'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema.dropTable('order_transaction')
            .then(function () {
                return trx.schema
                    .createTable('order_transaction', function (table) {
                        table.increments('id');
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
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema.dropTable('order_transaction')
            .then(function () {
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
    });
};
