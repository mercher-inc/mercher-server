'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        var payPalPermissions = [
                'EXPRESS_CHECKOUT',
                'DIRECT_PAYMENT',
                'SETTLEMENT_CONSOLIDATION',
                'SETTLEMENT_REPORTING',
                'AUTH_CAPTURE',
                'MOBILE_CHECKOUT',
                'BILLING_AGREEMENT',
                'REFERENCE_TRANSACTION',
                'AIR_TRAVEL',
                'MASS_PAY',
                'TRANSACTION_DETAILS',
                'TRANSACTION_SEARCH',
                'RECURRING_PAYMENTS',
                'ACCOUNT_BALANCE',
                'ENCRYPTED_WEBSITE_PAYMENTS',
                'REFUND',
                'NON_REFERENCED_CREDIT',
                'BUTTON_MANAGER',
                'MANAGE_PENDING_TRANSACTION_STATUS',
                'RECURRING_PAYMENT_REPORT',
                'EXTENDED_PRO_PROCESSING_REPORT',
                'EXCEPTION_PROCESSING_REPORT',
                'ACCOUNT_MANAGEMENT_PERMISSION',
                'ACCESS_BASIC_PERSONAL_DATA',
                'ACCESS_ADVANCED_PERSONAL_DATA',
                'INVOICING'
            ],
            payPalAccountTypes = [
                'PERSONAL',
                'PREMIER',
                'BUSINESS'
            ];
        return Promise.all([
            trx.schema.raw('CREATE TYPE "paypal_account_permission" AS ENUM (\'' + payPalPermissions.join('\', \'') + '\')'),
            trx.schema.raw('CREATE TYPE "paypal_account_type" AS ENUM (\'' + payPalAccountTypes.join('\', \'') + '\')')
        ]).then(function () {
            return trx.schema
                .createTable('shop_paypal_account', function (table) {
                    table.increments('id');
                    table.integer('shop_id')
                        .notNullable()
                        .references('id')
                        .inTable('shop')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                    table.string('account_email')
                        .notNullable();
                    table.string('account_id')
                        .notNullable();
                    table.string('first_name')
                        .notNullable();
                    table.string('last_name')
                        .notNullable();
                    table.string('business_name')
                        .notNullable();
                    table.specificType('account_type', 'paypal_account_type');
                    table.specificType('account_permissions', 'paypal_account_permission[]');
                    table.string('token')
                        .notNullable();
                    table.string('secret')
                        .notNullable();
                    table.timestamps();
                });
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .dropTable('shop_paypal_account')
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "paypal_account_permission"'),
                    trx.schema.raw('DROP TYPE "paypal_account_type"')
                ]);
            });
    });
};
