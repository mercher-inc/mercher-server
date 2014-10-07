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
                table.dropColumn('shipping_memo');
                table.dropColumn('shipping_email');
                table.dropColumn('shipping_name');
                table.dropColumn('shipping_country');
                table.dropColumn('shipping_state');
                table.dropColumn('shipping_city');
                table.dropColumn('shipping_street1');
                table.dropColumn('shipping_street2');
                table.dropColumn('shipping_zip');
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
                    table.json('shipping_address');
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
                table.dropColumn('shipping_address');
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
                    table.text('shipping_memo');
                    table.string('shipping_email');
                    table.string('shipping_name');
                    table.specificType('shipping_country', 'country_code')
                        .defaultTo('US')
                        .notNullable();
                    table.string('shipping_state');
                    table.string('shipping_city');
                    table.string('shipping_street1');
                    table.string('shipping_street2');
                    table.string('shipping_zip');
                });
            });
    });
};
