var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../modules/bookshelf'),
    UsersCollection = require('../../../collections/users'),
    UserModel = require('../../../models/user'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('./validation/collection.json'), {source: 'query', param: 'collectionForm'}));

// Fetch users collection
router.get('/', function (req, res, next) {
    var usersCollection = new UsersCollection();
    var userModel = new UserModel();

    var collectionRequest = usersCollection
        .query(function (qb) {
            qb
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['image']
        });

    var totalRequest = Bookshelf
        .knex(userModel.tableName)
        .count(userModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            users: collectionRequest,
            total: totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

router.use('/:userId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.param('userId', function (req, res, next) {
    //nothing to do here if userId is not "me"
    if (req.params.userId !== 'me') {
        next();
        return;
    }

    //user should be authorized to request "me"
    if (!req.currentUser) {
        next(new (require('./errors/unauthorized'))('User is not authorized'));
        return;
    }

    //everything is ok, setting userId
    req.params.userId = req.currentUser.get('id');

    next();
});

router.param('userId', function (req, res, next) {
    var userModel = new UserModel({id: parseInt(req.params.userId)});
    userModel.fetch({require: true})
        .then(function (model) {
            req.user = model;
            next();
        })
        .catch(UserModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("User was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:userId', function (req, res) {
    req.user
        .load('image')
        .then(function () {
            res.json(req.user);
        });
});

router.put(
    '/:userId',
    require('./middleware/auth_check'),
    function (req, res, next) {
        if (req.currentUser.id !== req.user.id) {
            var ForbiddenError = require('./errors/forbidden');
            next(new ForbiddenError('It\'s not your profile'));
        } else {
            next();
        }
    }
);

router.put('/:userId', validator(require('./validation/users/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:userId', function (req, res, next) {
    req.user
        .save(req['updateForm'])
        .then(function (userModel) {
            return userModel.load(['image']);
        })
        .then(function (userModel) {
            res.status(200).json(userModel);
        });
});

router.use('/:userId/managers', require('./users/managers'));
router.use('/:userId/orders', require('./users/orders'));
router.use('/:userId/shops', require('./users/shops'));

module.exports = router;
