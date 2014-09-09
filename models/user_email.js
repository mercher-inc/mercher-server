var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    UserModel = require('./user');

var UserEmailModel = BaseModel.extend(
    {
        tableName: 'user_email',

        user: function () {
            return this.belongsTo(UserModel);
        }
    }
);

module.exports = UserEmailModel;
