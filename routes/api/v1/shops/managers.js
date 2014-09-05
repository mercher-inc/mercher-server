var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
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
                .where('shop_id', '=', req.shop.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['user.image']
        });

    var totalRequest = bookshelf
        .knex(managerModel.tableName)
        .where('shop_id', '=', req.shop.id)
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
