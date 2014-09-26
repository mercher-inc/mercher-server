'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.raw('CREATE TYPE "product_availability" AS ENUM (\'inStock\', \'availableForOrder\', \'outOfStock\')'),
            trx.schema.raw('CREATE TYPE "product_age_group" AS ENUM (\'kids\', \'adult\')'),
            trx.schema.raw('CREATE TYPE "product_condition" AS ENUM (\'new\', \'refurbished\', \'used\')'),
            trx.schema.raw('CREATE TYPE "product_target_gender" AS ENUM (\'female\', \'male\', \'unisex\')')
        ]).then(function () {
            return trx.schema
                .table('product', function (table) {
                    table.specificType('availability', 'product_availability')
                        .defaultTo('inStock')
                        .notNullable();
                    table.specificType('age_group', 'product_age_group');
                    table.specificType('condition', 'product_condition')
                        .defaultTo('new')
                        .notNullable();
                    table.specificType('target_gender', 'product_target_gender');
                    table.timestamp('expiration_time');

                    table.string('brand');
                    table.string('manufacturer_part_number');
                    table.string('ean');
                    table.string('isbn');
                    table.string('upc');
                    table.string('color');
                    table.string('material');
                    table.string('pattern');
                    table.string('size');
                    table.string('weight');
                });
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('product', function (table) {
                table.dropColumn('availability');
                table.dropColumn('age_group');
                table.dropColumn('condition');
                table.dropColumn('target_gender');
                table.dropColumn('expiration_time');
                table.dropColumn('brand');
                table.dropColumn('manufacturer_part_number');
                table.dropColumn('ean');
                table.dropColumn('isbn');
                table.dropColumn('upc');
                table.dropColumn('color');
                table.dropColumn('material');
                table.dropColumn('pattern');
                table.dropColumn('size');
                table.dropColumn('weight');
            })
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "product_availability"'),
                    trx.schema.raw('DROP TYPE "product_age_group"'),
                    trx.schema.raw('DROP TYPE "product_condition"'),
                    trx.schema.raw('DROP TYPE "product_target_gender"')
                ]);
            });
    });
};
