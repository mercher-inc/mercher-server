var bookshelf = require('../modules/bookshelf');

var ShopThirdPartyAccountModel = bookshelf.Model.extend(
    {
        tableName:     'shop_third_party_account',
        hasTimestamps: true
    }
);

module.exports = ShopThirdPartyAccountModel;
