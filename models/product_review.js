var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ProductReviewModel = BaseModel.extend(
    {
        tableName: 'product_review',
        defaults:  {
            productId: null,
            userId:    null,
            rating:    null,
            comment:   null,
            isBanned:  false,
            createdAt: null,
            updatedAt: null
        },

        user:    function () {
            return this.belongsTo(require('./user'));
        },
        product: function () {
            return this.belongsTo(require('./product'));
        }
    }
);

module.exports = ProductReviewModel;
