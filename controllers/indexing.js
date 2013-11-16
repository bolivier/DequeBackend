var _ = require('underscore');
var lunr = require('lunr');
//totes mcgoats
lunr_index = lunr(function() {
	this.field('title', {boost: 10});
	this.field('body');
	this.field('id');
});

exports.index = function() {
	//get documents

	base_fb.child('users').once( 'value', function(fb_users) {
		var users = fb_users.val();
		_.each(users, function(val, key) {
			var description = val.personals.description;
			if(description === undefined) {
				description = "";
			}
			lunr_index.add ( {
				id: key, 
				title: val.personals.lastName + ", " + val.personals.firstName, 
				body: description});
		});
	});
};

exports.search = function(req, res) {
	console.log("params: ", req.params);
	var query = req.body.query;
	var result = lunr_index.search(query);
	res.send(result);
	return result;
};
