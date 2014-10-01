var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ShopsCollection = require('../../../../collections/shops'),
    ShopModel = require('../../../../models/shop'),
    ManagerModel = require('../../../../models/manager'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/shops/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var shopsCollection = new ShopsCollection();
    var shopModel = new ShopModel();

    var collectionRequest = shopsCollection
        .query(function (qb) {
            qb
                .join('manager', 'shop.id', 'manager.shop_id')
                .where('manager.user_id', '=', req.user.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['image', 'coverImage']
        });

    var totalRequest = Bookshelf
        .knex(shopModel.tableName)
        .join('manager', 'shop.id', 'manager.shop_id')
        .where('manager.user_id', '=', req.user.id)
        .count('shop.id')
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            shops: collectionRequest,
            total:  totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
