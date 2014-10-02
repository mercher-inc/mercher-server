(function (module, require) {

    var ManagerModel = require('../../../../models/manager'),
        ForbiddenError = require('../errors/forbidden');

    module.exports = function (getShopId, role, message) {
        return function (req, res, next) {
            var shopId = getShopId(req),
                userId = req.currentUser.id;

            new ManagerModel({userId: userId, shopId: shopId})
                .query(function (qb) {
                    qb.where('role', '>=', role);
                })
                .fetch({require: true})
                .then(function (managerModel) {
                    req.manager = managerModel;
                    next();
                })
                .catch(ManagerModel.NotFoundError, function () {
                    next(new ForbiddenError(message));
                });
        };
    };

})(module, require);
