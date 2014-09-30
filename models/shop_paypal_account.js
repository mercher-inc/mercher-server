var app = require('../app'),
    io = app.get('io'),
    Bookshelf = app.get('bookshelf');

var ShopPayPalAccountModel = Bookshelf.Model.extend(
    {
        tableName: 'shop_paypal_account'
    }
);

module.exports = ShopPayPalAccountModel;
