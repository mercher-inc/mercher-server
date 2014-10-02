var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    ManagersCollection = require('../../../../collections/managers'),
    ManagerModel = require('../../../../models/manager'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var managersCollection = new ManagersCollection();
    var managerModel = new ManagerModel();

    var collectionRequest = managersCollection
        .query(function (qb) {
            qb
                .where('user_id', '=', req.user.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['shop.image']
        });

    var totalRequest = Bookshelf
        .knex(managerModel.tableName)
        .where('user_id', '=', req.user.id)
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

module.exports = router;
