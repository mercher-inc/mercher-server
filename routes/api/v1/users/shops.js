var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ShopsCollection = require('../../../../collections/shops'),
    ShopModel = require('../../../../models/shop'),
    ManagerModel = require('../../../../models/manager');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.post('/', require('../middleware/auth_check'));
router.get('/', require('../middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var shopsCollection = new ShopsCollection();
    var shopModel = new ShopModel();

    var collectionRequest = shopsCollection
        .query(function (qb) {
            qb
                .join('manager', 'shop.id', 'manager.shop_id')
                .where('manager.user_id', '=', req.user.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
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
