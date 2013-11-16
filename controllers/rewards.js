var dwolla = require('dwolla');
var dw_cred = require('../credentials').dwolla;

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
							console.log('sending complete');
							res.status(200).send('sent: ', amount, data);
						}
					});
				}
				});
			});
		};

	exports.postAddMoneyToDeck = function(req, res) {
		var s_id = req.params.researcher_id;
		var amount = parseFloat(req.body.amount);
		var deck_id = req.body.deck_id;
		base_fb.child('users').child(s_id).child('personals')
			.once('value', function(researcher) {
				if(researcher && researcher.val().researcher) {
					var researcher_json = researcher.val();
					var current_balance = parseFloat(researcher_json.balance);
					base_fb.child('decks').child(deck_id)
				.once('value', function(deck) {
					var budget = parseFloat(deck.val().budget);
					var new_budget = (budget + amount).toFixed(2);
					var new_balance = (current_balance - amount).toFixed(2);
					base_fb.child('decks').child(deck_id).child('budget').set(new_budget);
					base_fb.child('users').child(s_id).child('personals').child('balance').set(new_balance);
				});
				}
			});
		res.send('dough transfer complete');
	};

	exports.postAddMoneyToAccount = function(req, res) {
		var s_id = req.params.researcher_id;
		var amount = parseFloat(req.body.amount);
		base_fb.child('users').child(s_id).child('personals')
			.once('value', function(researcher) {
				//check this is a researcher
				if (researcher && researcher.val().researcher) {
					console.log('Found researcher');
					var researcher_json = researcher.val();
					var current_balance = parseFloat(researcher_json.balance);

					//CALL DWOLLA IF THIS WERE REAL
					current_balance+=amount;
					current_balance = current_balance.toFixed(2);
					base_fb.child('users').child(s_id).child('personals')
				.child('balance').set(current_balance);
			console.log('Added money to account', current_balance, researcher_json.lastName);
				}
			});
		res.send('Added Moolah.');
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

