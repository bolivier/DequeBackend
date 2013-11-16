var creds = require('../credentials');
var twilio = require('twilio');
var twilio_client = new twilio.RestClient(creds.twilio.sid, creds.twilio.token);
var sendgrid = require('sendgrid')(creds.sendgrid.api_user,
		creds.sendgrid.api_key);


exports.send = function(req, res) {
	var message = req.body.message;
	var subject = req.body.subject;
	base_fb.child('users').child(req.params.subject_id)
		.once('value', function(user) {
			var user_attribs = user.val();
			//always send email
			console.log(user_attribs);
			sendgrid.send({
				to: user_attribs.personals.email,
				from: 'nick@deque.com',
				subject: subject,
				text: message
			}, function(err, response) {
				if (err){
					console.log('ERROR in the mailroom!');
				}
				else {
					console.log('HAPPY in the mailroom!');
				}
				console.log(response);
			});
			//phone
			if (user_attribs.personals.texts) {
				//send text messages if opt'ed-in
				twilio_client.sendSms({
					to: user_attribs.personals.phone,
					from: creds.twilio.phone,
					body: message
				},  function(txterr, txtresponse) {
				if (txterr){
					console.log('ERROR in the text-room!', txtresponse);
				}
				else {
					console.log('HAPPY in the text-room!');
				}
			});
			}
			res.status(200).send('Message sent.');
		},
		function(data) {
			res.status(403).send('Message sending failed.');
		}
	);
};

