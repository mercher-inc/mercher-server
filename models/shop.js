var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ShopModel = BaseModel.extend(
    {
        tableName: 'shop',
        defaults:  {
            imageId:           null,
            coverImageId:      null,
            title:             'New shop',
            subtitle:          null,
            description:       null,
            rating:            null,
            tax:               0,
            street1:           null,
            street2:           null,
            locality:          null,
            region:            null,
            postalCode:        null,
            country:           'US',
            email:             null,
            phoneNumber:       null,
            faxNumber:         null,
            website:           null,
            workingHours:      null,
            shippingCountries: null,
            paypalAccountId:   null,
            googleAnalyticsId: null,
            isPublic:          true,
            isBanned:          false,
            createdAt:         null,
            updatedAt:         null
        },

        image:          function () {
            return this.belongsTo(require('./image'));
        },
        coverImage:     function () {
            return this.belongsTo(require('./image'), 'cover_image_id');
        },
        payPalAccounts: function () {
            return this.belongsToMany(require('./paypal_account'), 'shop_paypal_account');
        }
    }
);

module.exports = ShopModel;
