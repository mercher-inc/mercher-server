var express = require('express'),
    router = express.Router();

router.use(function (req, res, next) {
    var ogParams = {
        fb: {
            admins:     [],
            app_id:     process.env.FB_APP_ID,
            profile_id: ''
        },
        og: {
            title:       'Mercher',
            description: "Description",
            site_name:   'mercher.net',
            url:         'http://mercher.net',
            type:        'website',
            image:       {
                url:            '',
                secure_url:     '',
                type:           '',
                width:          '',
                height:         '',
                user_generated: 'false'
            }
        }
    };
    res.render('index', ogParams);
});

module.exports = router;
