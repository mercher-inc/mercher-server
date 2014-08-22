'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.createTable('image', function (table) {
                table.increments('id');
                table.string('title');
                table.text('description');
                table.string('key');
                table.json('crop_geometry');
                table.json('files');
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
            trx.schema.createTable('access_token', function (table) {
                table.increments('id');
                table.integer('user_id')
                    .references('id')
                    .inTable('user')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
                table.string('token', 40);
                table.timestamp('expires')
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
                table.float('tax')
                    .defaultTo(0)
                    .notNullable();
                table.float('rating');
                table.boolean('is_active')
                    .defaultTo(true)
                    .notNullable();
                table.boolean('is_banned')
                    .defaultTo(false)
                    .notNullable();
                table.timestamps();
            }),
            trx.schema.raw("CREATE TYPE manager_role AS ENUM ('editor', 'seller', 'owner')"),
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
                table.specificType('role', 'manager_role')
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
            trx.schema.raw("DROP TYPE manager_role"),
            trx.schema.dropTable('shop'),
            trx.schema.dropTable('access_token'),
            trx.schema.dropTable('user'),
            trx.schema.dropTable('image')
        ])
    });
};
