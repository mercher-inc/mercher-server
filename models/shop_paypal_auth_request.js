var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ShopPayPalAuthRequestModel = BaseModel.extend(
    {
        tableName: 'shop_paypal_auth_request',

        shop: function () {
            return this.belongsTo(require('./shop'));
        }
    }
);

module.exports = ShopPayPalAuthRequestModel;
