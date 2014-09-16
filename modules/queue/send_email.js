var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    transporter = nodemailer.createTransport(
        smtpTransport({
            port:   465,
            host:   'email-smtp.us-west-2.amazonaws.com',
            secure: true,
            auth:   {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
            debug:  true
        })
    );

module.exports = function (job, done) {
    var ActivationCodeModel = require('../../models/activation_code');
    new ActivationCodeModel({id: job.data.activationCodeId})
        .fetch({require: true, withRelated: ['userEmail.user']})
        .then(function (activationCodeModel) {
            var userEmailModel = activationCodeModel.related('userEmail'),
                userModel = userEmailModel.related('user'),
                to = userEmailModel.get('email');

            var userName = [];
            if (userModel.get('firstName')) {
                userName.push(userModel.get('firstName'));
            }
            if (userModel.get('lastName')) {
                userName.push(userModel.get('lastName'));
            }
            if (userName.length) {
                to = {
                    name:    userName.join(' '),
                    address: userEmailModel.get('email')
                };
            }

            transporter.sendMail({
                from:    {
                    name:    'Mercher Notifications',
                    address: 'noreply@mercher.net'
                },
                to:      to,
                subject: 'Email activation code',
                text:    activationCodeModel.get('code')
            }, function (err, info) {
                if (err) {
                    done && done(err);
                    return;
                }
                done && done(null, info);
            });
        })
        .catch(ActivationCodeModel.NotFoundError, function (err) {
            done && done(err);
        });
};