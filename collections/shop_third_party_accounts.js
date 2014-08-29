var bookshelf = require('../modules/bookshelf'),
    ShopThirdPartyAccountModel = require('../models/shop_third_party_account');

var ShopThirdPartyAccountsCollection = bookshelf.Collection.extend(
    {
        model: ShopThirdPartyAccountModel
    }
);

module.exports = ShopThirdPartyAccountsCollection;
