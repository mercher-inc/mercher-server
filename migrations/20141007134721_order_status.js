'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        var orderStatuses = [
            'draft',
            'pending',
            'canceled',
            'submitted',
            'received',
            'rejected',
            'refunded',
            'completed',
            'error'
        ];

        return trx.schema
            .table('order', function (table) {
                table.dropColumn('status');
            })
            .then(function () {
                return trx.schema.raw('DROP TYPE "order_status"');
            })
            .then(function () {
                return trx.schema.raw('CREATE TYPE "order_status" AS ENUM (\'' + orderStatuses.join('\', \'') + '\')');
            })
            .then(function () {
                return trx.schema.table('order', function (table) {
                    table.specificType('status', 'order_status')
                        .defaultTo('draft')
                        .notNullable();
                    table.string('reason');
                    table.text('memo');
                });
            });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        var orderStatuses = [
            'draft',
            'submitted',
            'received',
            'rejected',
            'completed'
        ];

        return trx.schema
            .table('order', function (table) {
                table.dropColumn('status');
                table.dropColumn('reason');
                table.dropColumn('memo');
            })
            .then(function () {
                return trx.schema.raw('DROP TYPE "order_status"');
            })
            .then(function () {
                return trx.schema.raw('CREATE TYPE "order_status" AS ENUM (\'' + orderStatuses.join('\', \'') + '\')');
            })
            .then(function () {
                return trx.schema.table('order', function (table) {
                    table.specificType('status', 'order_status')
                        .defaultTo('draft')
                        .notNullable();
                });
            });
    });
};
