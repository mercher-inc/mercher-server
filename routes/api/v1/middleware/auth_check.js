(function (module, require) {

    module.exports = function (req, res, next) {
        if (!req.currentUser) {
            next(new (require('../errors/unauthorized'))('User is not authorized'));
        } else {
            next();
        }
    };

})(module, require);
