'use strict';

exports.up = function(knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .raw('CREATE TYPE "product_availability" AS ENUM (\'preorder\', \'inStock\', \'availableForOrder\', \'outOfStock\')')
            .then(function(){
                return trx.schema
                    .table('product', function (table) {
                        table.specificType('availability', 'product_availability')
                            .defaultTo('inStock')
                            .notNullable();
                    });
            });
    });
};

exports.down = function(knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('product', function (table) {
                table.dropColumn('availability')
            })
            .then(function(){
                return trx.schema.raw('DROP TYPE "product_availability"');
            });
    });
};
