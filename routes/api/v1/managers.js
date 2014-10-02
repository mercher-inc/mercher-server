var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../modules/bookshelf'),
    ManagersCollection = require('../../../collections/managers'),
    ManagerModel = require('../../../models/manager'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', require('./middleware/collection_params_check'));

router.get('/', validator(require('./validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var managersCollection = new ManagersCollection();
    var managerModel = new ManagerModel();

    var collectionRequest = managersCollection
        .query(function (qb) {
            qb
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['shop.image', 'user.image']
        });

    var totalRequest = bookshelf
        .knex(managerModel.tableName)
        .count(managerModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            managers: collectionRequest,
            total:    totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/managers/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new ManagerModel()
        .save(req['createForm'])
        .then(function (managerModel) {
            return managerModel.load(['shop.image', 'user.image']);
        })
        .then(function (managerModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/managers/' + managerModel.id);
            res.status(201).json(managerModel);
        });
});

router.use('/:managerId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('managerId', function (req, res, next) {
    var managerModel = new ManagerModel({id: parseInt(req.params.managerId)});
    managerModel.fetch({require: true})
        .then(function (model) {
            req.manager = model;
            next();
        })
        .catch(ManagerModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("Manager was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:managerId', function (req, res) {
    req.manager
        .load(['shop.image', 'user.image'])
        .then(function () {
            res.json(req.manager);
        });
});

router.put('/:managerId', require('./middleware/auth_check'));

router.put('/:managerId', validator(require('./validation/managers/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:managerId', function (req, res, next) {
    req.manager
        .save(req['updateForm'])
        .then(function (managerModel) {
            return managerModel.load(['shop.image', 'user.image']);
        })
        .then(function (managerModel) {
            res.status(200).json(managerModel);
        });
});

module.exports = router;
