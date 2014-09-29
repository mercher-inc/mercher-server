'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema.raw('CREATE TYPE "image_color_schema" AS ENUM (\'light\', \'dark\')')
        ]).then(function () {
            return trx.schema
                .table('image', function (table) {
                    table.specificType('main_color', 'CHAR(7)');
                    table.specificType('color_schema', 'image_color_schema')
                        .defaultTo('light')
                        .notNullable();
                });
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('image', function (table) {
                table.dropColumn('main_color');
                table.dropColumn('color_schema');
            })
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "image_color_schema"')
                ]);
            });
    });
};
