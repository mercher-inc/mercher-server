var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ShopThirdPartyAccountModel = BaseModel.extend(
    {
        tableName: 'shop_third_party_account'
    }
);

module.exports = ShopThirdPartyAccountModel;
