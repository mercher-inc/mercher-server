var express = require('express'),
    router = express.Router();

router.use(function (req, res, next) {
    req.openGraphObject = {
        fb: {
            admins:     ['100001974932720'],
            app_id:     process.env.FB_APP_ID,
            profile_id: '430253050396911'
        },
        og: {
            title:     'Mercher',
            site_name: 'Mercher',
            url:       'http://staging.mercherdev.com/',
            type:      'website',
            image:     {
                url:            'http://staging.mercherdev.com/images/logoOnGreen_512.png',
                type:           'image/png',
                width:          '512',
                height:         '512',
                user_generated: 'false'
            }
        }
    };
    next();
});

router.use('/products', require('./products'));

router.use(function (req, res, next) {
    res.render('index', {openGraphObject: req.openGraphObject}, function (err, html) {
        res.status(200).type('html').send(html);
    });
});

module.exports = router;
