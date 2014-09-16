var jade = require('jade'),
    path = require('path'),
    nodemailer = require('nodemailer'),
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
                to = userEmailModel.get('email'),
                template = jade.compileFile(path.normalize(__dirname + '../../../views/emails/activation_code.jade'));

            var userName = [];
            if (userModel.get('firstName')) {
                userName.push(userModel.get('firstName'));
            }
            if (userModel.get('lastName')) {
                userName.push(userModel.get('lastName'));
            }
            if (userName.length) {
                userName = userName.join(' ');
                to = {
                    name:    userName,
                    address: userEmailModel.get('email')
                };
            } else {
                userName = 'Customer';
            }

            var htmlBody = template({
                userName:       userName,
                email:          userEmailModel.get('email'),
                activationCode: activationCodeModel.get('code'),
                activationUrl:  'http://staging.mercherdev.com/auth/acrivateEmail/' + activationCodeModel.get('code')
            });

            transporter.sendMail({
                from:    {
                    name:    'Mercher Notifications',
                    address: 'noreply@mercher.net'
                },
                to:      to,
                subject: 'Email activation code',
                text:    activationCodeModel.get('code'),
                html:    htmlBody
            }, function (err, info) {
                if (err) {
                    done && done(err);
                    userEmailModel.save({isBanned:true});
                    return;
                }
                done && done(null, info);
            });
        })
        .catch(ActivationCodeModel.NotFoundError, function (err) {
            done && done(err);
        });
};