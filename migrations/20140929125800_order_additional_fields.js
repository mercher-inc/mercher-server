'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema
                .raw('ALTER TABLE "order" ALTER COLUMN "user_id" DROP NOT NULL'),
            trx.schema
                .table('order', function (table) {
                    table.string('pay_key');
                    table.timestamp('expires');
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
                })
        ]);
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return Promise.all([
            trx.schema
                .raw('ALTER TABLE "order" ALTER COLUMN "user_id" SET NOT NULL'),
            trx.schema
                .table('order', function (table) {
                    table.dropColumn('pay_key');
                    table.dropColumn('expires');
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
        ]);
    });
};
