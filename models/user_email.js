var bookshelf = require('../modules/bookshelf'),
    UserModel = require('./user');

var UserEmailModel = bookshelf.Model.extend(
    {
        tableName:     'user_email',
        hasTimestamps: true,
        user:          function () {
            return this.belongsTo(UserModel);
        }
    }
);

module.exports = UserEmailModel;
