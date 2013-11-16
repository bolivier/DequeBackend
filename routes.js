var reward = require('./controllers/rewards');
var communication = require('./controllers/communication');
var lunr = require('./controllers/indexing');
module.exports =  function(app) {

	//GET
	app.get('/', public/index.html);

	//POST
	app.post('/api/decks/:deck_id/users/:subject_id/reward', reward.postReward);
	app.post('/api/users/:researcher_id/add_funds', reward.postAddMoneyToAccount);
	app.post('/api/users/:researcher_id/transfer_funds', reward.postAddMoneyToDeck);
	app.post('/api/users/:subject_id/send', communication.send);
	app.post('/api/find_users/', lunr.search);

	
	//PUT
	
	//DELETE

};
