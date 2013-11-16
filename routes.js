var reward = require('./controllers/rewards.js');
var communication = require('./controllers/communication.js');
module.exports =  function(app) {

	//GET
	//app.get('/', routes.index);

	//POST
	app.post('/api/decks/:deck_id/users/:subject_id/reward', reward.postReward);
	app.post('/api/users/:researcher_id/add_funds', reward.postAddMoneyToAccount);
	app.post('/api/users/:researcher_id/transfer_funds', reward.postAddMoneyToDeck);
	app.post('/api/users/:subject_id/send', communication.send);
	
	//PUT
	
	//DELETE

};
