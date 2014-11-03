var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ShopReviewModel = BaseModel.extend(
    {
        tableName: 'shop_review',
        defaults:  {
            shopId:    null,
            userId:    null,
            rating:    null,
            comment:   null,
            isBanned:  false,
            createdAt: null,
            updatedAt: null
        },

        user: function () {
            return this.belongsTo(require('./user'));
        },
        shop: function () {
            return this.belongsTo(require('./shop'));
        }
    }
);

module.exports = ShopReviewModel;
