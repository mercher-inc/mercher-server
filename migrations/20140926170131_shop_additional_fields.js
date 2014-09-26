'use strict';

exports.up = function (knex, Promise) {
    return knex.transaction(function (trx) {
        var countries = [
            'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH',
            'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF',
            'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR',
            'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK',
            'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU',
            'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM',
            'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR',
            'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX',
            'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'AN', 'NC', 'NZ', 'NI', 'NE',
            'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR',
            'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS',
            'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE',
            'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA',
            'AE', 'GB', 'UK', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'
        ];
        return Promise.all([
            trx.schema.raw('CREATE TYPE "country_code" AS ENUM (\'' + countries.join('\', \'') + '\')')
        ]).then(function () {
            return trx.schema
                .table('shop', function (table) {
                    table.integer('cover_image_id')
                        .references('id')
                        .inTable('image')
                        .onDelete('SET NULL')
                        .onUpdate('CASCADE');
                    table.decimal('rating', 2, 1);
                    table.string('street_address');
                    table.string('locality');
                    table.string('region');
                    table.string('postal_code');
                    table.specificType('country', 'country_code')
                        .defaultTo('US')
                        .notNullable();
                    table.string('email');
                    table.string('phone_number');
                    table.string('fax_number');
                    table.string('website');
                    table.json('working_hours');
                    table.specificType('shipping_countries', 'country_code[]');
                });
        });
    });
};

exports.down = function (knex, Promise) {
    return knex.transaction(function (trx) {
        return trx.schema
            .table('shop', function (table) {
                table.dropColumn('cover_image_id');
                table.dropColumn('rating');
                table.dropColumn('street_address');
                table.dropColumn('locality');
                table.dropColumn('region');
                table.dropColumn('postal_code');
                table.dropColumn('country');
                table.dropColumn('email');
                table.dropColumn('phone_number');
                table.dropColumn('fax_number');
                table.dropColumn('website');
                table.dropColumn('working_hours');
                table.dropColumn('shipping_countries');
            })
            .then(function () {
                return Promise.all([
                    trx.schema.raw('DROP TYPE "country_code"')
                ]);
            });
    });
};
