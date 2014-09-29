'use strict';

exports.up = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema
            .createTable('product_review', function (table) {
                table.increments('id');
                table.integer('product_id')
                    .notNullable()
                    .references('id')
                    .inTable('product')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                table.integer('user_id')
                    .notNullable()
                    .references('id')
                    .inTable('user')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                table.integer('rating')
                    .notNullable();
                table.text('comment');
                table.boolean('is_banned')
                    .defaultTo(false)
                    .notNullable();
                table.timestamps();
            });
    });
};

exports.down = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema.dropTable('product_review');
    });
};
