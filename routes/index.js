var express = require('express'),
    router = express.Router();

router.use(function (req, res, next) {
    var ogParams = {
        fb: {
            admins:     '100001974932720',
            app_id:     process.env.FB_APP_ID,
            profile_id: '430253050396911'
        },
        og: {
            title:       'Mercher',
            description: "Description",
            site_name:   'mercher.net',
            url:         'http://staging.mercherdev.com/',
            type:        'website',
            image:       {
                url:            'http://staging.mercherdev.com/images/logoOnGreen_512.png',
                type:           'image/png',
                width:          '512',
                height:         '512',
                user_generated: 'false'
            }
        }
    };
    res.render('index', ogParams);
});

module.exports = router;
