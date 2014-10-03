'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        var payPalPaymentExecStatus = [
            'CREATED',
            'COMPLETED',
            'INCOMPLETE',
            'ERROR',
            'REVERSALERROR',
            'PROCESSING',
            'PENDING'
        ];
        return Promise.all([
            trx.schema.raw('CREATE TYPE "paypal_payment_exec_status" AS ENUM (\'' + payPalPaymentExecStatus.join('\', \'') + '\')')
        ]).then(function () {
            return trx.schema
                .table('order', function (table) {
                    table.specificType('payment_exec_status', 'paypal_payment_exec_status');
                })
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('order', function (table) {
                table.dropColumn('payment_exec_status');
            })
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "paypal_payment_exec_status"')
                ]);
            });
    });
};
