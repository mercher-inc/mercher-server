var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    ManagersCollection = require('../../../../collections/managers'),
    ManagerModel = require('../../../../models/manager');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', require('../middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var managersCollection = new ManagersCollection();
    var managerModel = new ManagerModel();

    var collectionRequest = managersCollection
        .query(function (qb) {
            qb
                .where('user_id', '=', req.user.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
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
