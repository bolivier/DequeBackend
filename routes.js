
var reward = require('./controllers/rewards.js');
module.exports =  function(app) {

	//GET
	//app.get('/', routes.index);

	//POST
	app.post('/api/decks/:deck_id/users/:subject_id/reward', reward.postReward);
	
	//PUT
	
	//DELETE

};
