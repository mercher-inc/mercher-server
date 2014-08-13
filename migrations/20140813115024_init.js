'use strict';

exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('user', function (table) {
            table.increments('id');
            table.string('first_name');
            table.string('last_name');
            table.timestamps();
        }),
        knex.schema.createTable('shop', function (table) {
            table.increments('id');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('user'),
        knex.schema.dropTable('shop')
    ]);
};
