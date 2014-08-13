'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.createTable('image', function (table) {
                table.increments('id');
                table.string('title');
                table.text('description');
                table.string('file');
                table.boolean('is_active')
                    .defaultTo(true)
                    .notNullable();
                table.boolean('is_banned')
                    .defaultTo(false)
                    .notNullable();
                table.timestamps();
            }),
            trx.schema.createTable('user', function (table) {
                table.increments('id');
                table.integer('image_id')
                    .references('id')
                    .inTable('image')
                    .onDelete('SET NULL')
                    .onUpdate('CASCADE');
                table.string('first_name');
                table.string('last_name');
                table.string('email')
                    .notNullable();
                table.string('password', 40);
                table.timestamp('last_login');
                table.boolean('is_active')
                    .defaultTo(true)
                    .notNullable();
                table.boolean('is_banned')
                    .defaultTo(false)
                    .notNullable();
                table.timestamps();
            }),
            trx.schema.createTable('shop', function (table) {
                table.increments('id');
                table.integer('image_id')
                    .references('id')
                    .inTable('image')
                    .onDelete('SET NULL')
                    .onUpdate('CASCADE');
                table.string('title')
                    .notNullable();
                table.text('description');
                table.string('location');
                table.float('tax', 4, 2)
                    .defaultTo(0)
                    .notNullable();
                table.float('rating', 3, 2);
                table.boolean('is_active')
                    .defaultTo(true)
                    .notNullable();
                table.boolean('is_banned')
                    .defaultTo(false)
                    .notNullable();
                table.timestamps();
            }),
            trx.schema.createTable('manager', function (table) {
                table.increments('id');
                table.integer('user_id')
                    .references('id')
                    .inTable('user')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                table.integer('shop_id')
                    .references('id')
                    .inTable('shop')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                table.enu('role', ['editor', 'seller', 'owner'])
                    .notNullable();
                table.boolean('is_public')
                    .defaultTo(true)
                    .notNullable();
                table.boolean('is_active')
                    .defaultTo(true)
                    .notNullable();
                table.boolean('is_banned')
                    .defaultTo(false)
                    .notNullable();
                table.timestamps();
            })
        ]);
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.dropTable('manager'),
            trx.schema.dropTable('shop'),
            trx.schema.dropTable('user'),
            trx.schema.dropTable('image')
        ])
    });
};
