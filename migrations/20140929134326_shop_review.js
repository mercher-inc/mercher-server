'use strict';

exports.up = function (knex) {
    return knex.transaction(function (trx) {
        return trx.schema
            .createTable('shop_review', function (table) {
                table.increments('id');
                table.integer('shop_id')
                    .notNullable()
                    .references('id')
                    .inTable('shop')
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
        return trx.schema.dropTable('shop_review');
    });
};
