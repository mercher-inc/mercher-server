var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base');

var OrderItemModel = BaseModel.extend(
    {
        tableName:     'order_item',
        hasTimestamps: true,
        order:         function () {
            return this.belongsTo(require('./order'));
        },
        product:       function () {
            return this.belongsTo(require('./product'));
        }
    }
);

module.exports = OrderItemModel;
