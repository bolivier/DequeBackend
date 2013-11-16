var dwolla = require('dwolla');
var dw_cred = require('../controllers/dwolla').credentials;
exports.postReward = function(req, res) {
	var s_id = req.params.subject_id;
	base_fb.child('users').child(s_id).child('personals').child('email')
		.once('value', function(subject_email) {
			subject_email = subject_email.val().trim();
			var amount = parseFloat(req.body.amount);
			var deck_id = req.params.deck_id;
			base_fb.child('decks').child(deck_id).child('budget')
			.once('value', function(budget) {
				console.log('budget: ', budget.val());
				var new_budget = parseFloat(budget.val()) - amount;

				//FIX THE PARAMS IN THE DWOLLA CALL

				var validation = validate(subject_email, amount, budget.val(), new_budget);
				//call to dwolla
				if (!validation.status) {
					console.log(validation);
					res.status(403).send(validation.message);
				}
				else {
					console.log(amount);
					// dwolla.send(dw_cred.token, dw_cred.pin, "alexandermarquina@gmail.com", amount,  function (err, data) {
					console.log(subject_email);
					dwolla.send(dw_cred.token, dw_cred.pin, subject_email, amount, {'destinationType': 'Email'},  function (err, data) {
						if(err) {
							console.log(err);
							res.status(403).send("sending error");
						}
						else {
							base_fb.child('decks').child(deck_id).child('budget').set(new_budget);
							console.log("sending complete");
							res.status(200).send('sent: ', amount, data);
						}
					});
				}
			});
		});
};

/* status is true when all are valid */
var validate = function(subject_email, amount, budget, new_budget) {
	var exit_status = ((amount > 0) && budget && (new_budget >= 0));
	if (!exit_status) {
		if (new_budget < 0) 
			return {status: false, message: 'Not enough dough'};
		else
			return {status: false, message: 'DB error'};
	}
	else
		return {status: true, message: 'Valid'};
};

