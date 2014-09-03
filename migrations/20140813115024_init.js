'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema
                .createTable('image', function (table) {
                    table.increments('id');
                    table.string('title');
                    table.text('description');
                    table.string('key')
                        .notNullable();
                    table.string('origin')
                        .notNullable();
                    table.json('dimensions')
                        .notNullable();
                    table.json('crop_geometry')
                        .notNullable();
                    table.json('files');
                    table.boolean('is_active')
                        .defaultTo(false)
                        .notNullable();
                    table.boolean('is_banned')
                        .defaultTo(false)
                        .notNullable();
                    table.timestamps();
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_image_key" ON "image" ("key")');
                }),
            trx.schema
                .createTable('user', function (table) {
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
                        .defaultTo(false)
                        .notNullable();
                    table.boolean('is_banned')
                        .defaultTo(false)
                        .notNullable();
                    table.timestamps();
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_user_email" ON "user" ("email")');
                }),
            trx.schema
                .raw('CREATE TYPE "third_party_account_provider" AS ENUM (\'facebook\', \'google\')'),
            trx.schema
                .createTable('user_third_party_account', function (table) {
                    table.increments('id');
                    table.integer('user_id')
                        .references('id')
                        .inTable('user')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                    table.specificType('provider', 'third_party_account_provider')
                        .notNullable();
                    table.string('provider_id')
                        .notNullable();
                    table.timestamps();
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_user_third_party_account_provider_provider_id" ON "user_third_party_account" ("provider", "provider_id")');
                }),
            trx.schema
                .createTable('access_token', function (table) {
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
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_access_token_token" ON "access_token" ("token")');
                }),
            trx.schema
                .raw('CREATE TYPE "activation_code_purpose" AS ENUM (\'email_activation\', \'password_reset\')'),
            trx.schema
                .createTable('activation_code', function (table) {
                    table.increments('id');
                    table.integer('user_id')
                        .references('id')
                        .inTable('user')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                    table.specificType('purpose', 'activation_code_purpose')
                        .notNullable();
                    table.string('code', 40);
                    table.timestamps();
                })
                .then(function () {
                    return Promise.all([
                        trx.schema.raw('CREATE UNIQUE INDEX "u_activation_code_purpose_code" ON "activation_code" ("code")'),
                        trx.schema.raw('CREATE UNIQUE INDEX "u_activation_code_purpose_user_id_purpose" ON "activation_code" ("user_id", "purpose")')
                    ]);
                }),
            trx.schema
                .createTable('shop', function (table) {
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
                    table.boolean('is_public')
                        .defaultTo(true)
                        .notNullable();
                    table.boolean('is_banned')
                        .defaultTo(false)
                        .notNullable();
                    table.timestamps();
                }),
            trx.schema
                .createTable('shop_third_party_account', function (table) {
                    table.increments('id');
                    table.integer('shop_id')
                        .references('id')
                        .inTable('shop')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                    table.specificType('provider', 'third_party_account_provider')
                        .notNullable();
                    table.string('provider_id')
                        .notNullable();
                    table.timestamps();
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_shop_third_party_account_provider_provider_id" ON "shop_third_party_account" ("provider", "provider_id")');
                }),
            trx.schema
                .raw('CREATE TYPE "manager_role" AS ENUM (\'editor\', \'seller\', \'owner\')'),
            trx.schema
                .createTable('manager', function (table) {
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
                    table.specificType('role', 'manager_role');
                    table.boolean('is_public')
                        .defaultTo(true)
                        .notNullable();
                    table.boolean('is_banned')
                        .defaultTo(false)
                        .notNullable();
                    table.timestamps();
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_manager_user_id_shop_id" ON "manager" ("user_id", "shop_id")');
                }),
            trx.schema
                .createTable('category', function (table) {
                    table.increments('id');
                    table.integer('image_id')
                        .references('id')
                        .inTable('image')
                        .onDelete('SET NULL')
                        .onUpdate('CASCADE');
                    table.string('title')
                        .notNullable();
                    table.boolean('is_public')
                        .defaultTo(true)
                        .notNullable();
                    table.timestamps();
                }),
            trx.schema
                .createTable('product', function (table) {
                    table.increments('id');
                    table.integer('shop_id')
                        .notNullable()
                        .references('id')
                        .inTable('shop')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.integer('category_id')
                        .references('id')
                        .inTable('category')
                        .onDelete('SET NULL')
                        .onUpdate('CASCADE');
                    table.string('title')
                        .notNullable();
                    table.text('description');
                    table.decimal('price', 8, 2);
                    table.decimal('shipping_cost', 8, 2);
                    table.float('shipping_weight');
                    table.integer('amount_in_stock');
                    table.boolean('is_unique')
                        .defaultTo(false)
                        .notNullable();
                    table.boolean('is_public')
                        .defaultTo(true)
                        .notNullable();
                    table.boolean('is_banned')
                        .defaultTo(false)
                        .notNullable();
                    table.timestamps();
                }),
            trx.schema
                .createTable('product_image', function (table) {
                    table.increments('id');
                    table.integer('product_id')
                        .notNullable()
                        .references('id')
                        .inTable('product')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.integer('image_id')
                        .notNullable()
                        .references('id')
                        .inTable('image')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                    table.integer('priority')
                        .defaultTo(0)
                        .notNullable();
                    table.boolean('is_public')
                        .defaultTo(true)
                        .notNullable();
                    table.timestamps();
                })
                .then(function () {
                    return trx.schema.raw('CREATE UNIQUE INDEX "u_product_image_product_id_image_id" ON "product_image" ("product_id", "image_id")');
                }),
            trx.schema
                .raw('CREATE TYPE "order_status" AS ENUM (\'draft\', \'submitted\', \'received\', \'rejected\', \'completed\')'),
            trx.schema
                .createTable('order', function (table) {
                    table.increments('id');
                    table.integer('user_id')
                        .notNullable()
                        .references('id')
                        .inTable('user')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.integer('manager_id')
                        .references('id')
                        .inTable('manager')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.integer('shop_id')
                        .notNullable()
                        .references('id')
                        .inTable('shop')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.specificType('status', 'order_status')
                        .defaultTo('draft')
                        .notNullable();
                    table.decimal('price_total', 12, 2);
                    table.decimal('shipping_cost_total', 12, 2);
                    table.decimal('tax_total', 12, 2);
                    table.timestamps();
                }),
            trx.schema
                .createTable('order_item', function (table) {
                    table.increments('id');
                    table.integer('order_id')
                        .notNullable()
                        .references('id')
                        .inTable('order')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.integer('product_id')
                        .notNullable()
                        .references('id')
                        .inTable('product')
                        .onDelete('RESTRICT')
                        .onUpdate('CASCADE');
                    table.decimal('price', 8, 2);
                    table.decimal('shipping_cost', 8, 2);
                    table.integer('amount');
                    table.timestamps();
                })
        ]);
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.dropTable('order_item'),
            trx.schema.dropTable('order'),
            trx.schema.raw('DROP TYPE "order_status"'),
            trx.schema.dropTable('product_image'),
            trx.schema.dropTable('product'),
            trx.schema.dropTable('category'),
            trx.schema.dropTable('manager'),
            trx.schema.raw('DROP TYPE "manager_role"'),
            trx.schema.dropTable('shop_third_party_account'),
            trx.schema.dropTable('shop'),
            trx.schema.dropTable('activation_code'),
            trx.schema.raw('DROP TYPE "activation_code_purpose"'),
            trx.schema.dropTable('access_token'),
            trx.schema.dropTable('user_third_party_account'),
            trx.schema.raw('DROP TYPE "third_party_account_provider"'),
            trx.schema.dropTable('user'),
            trx.schema.dropTable('image')
        ])
    });
};
