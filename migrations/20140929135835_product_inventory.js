'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.raw('CREATE TYPE "product_inventory_bucket_type" AS ENUM (\'available\', \'reserved\', \'selling\', \'sold\')')
        ]).then(function () {
            return trx.schema
                .createTable('product_inventory_bucket', function (table) {
                    table.increments('id');
                    table.integer('product_id')
                        .notNullable()
                        .references('id')
                        .inTable('product')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                    table.integer('order_item_id')
                        .references('id')
                        .inTable('order_item')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.integer('amount')
                        .defaultTo(0)
                        .notNullable();
                    table.specificType('type', 'product_inventory_bucket_type');
                    table.timestamps();
                });
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .dropTable('product_inventory_bucket')
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "product_inventory_bucket_type"')
                ]);
            });
    });
};
