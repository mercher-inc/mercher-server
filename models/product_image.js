var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var ProductImageModel = BaseModel.extend(
    {
        tableName: 'product_image',

        image:   function () {
            return this.belongsTo(require('./image'));
        },
        product: function () {
            return this.belongsTo(require('./product'));
        }
    }
);

module.exports = ProductImageModel;
