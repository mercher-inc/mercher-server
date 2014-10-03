var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ShopPayPalAuthRequestModel = BaseModel.extend(
    {
        tableName: 'shop_paypal_auth_request',

        shop: function () {
            return this.belongsTo(require('./shop'));
        }
    },
    {
        generate: function (credentials) {
            var ShopPayPalAuthRequestModel = this,
                PayPal = require('../modules/paypal'),
                payPalClient = new PayPal;

            return payPalClient
                .send('Permissions/RequestPermissions', {
                    scope:    [
                        'REFUND',
                        'ACCESS_BASIC_PERSONAL_DATA',
                        'ACCESS_ADVANCED_PERSONAL_DATA'
                    ],
                    callback: credentials['returnUrl']
                })
                .then(function (payPalResponse) {
                    return new ShopPayPalAuthRequestModel()
                        .save({requestToken: payPalResponse.token, shopId: credentials['shopId']})
                });
        }
    }
);

module.exports = ShopPayPalAuthRequestModel;
