
/*
 * Module dependencies.
 */

var _ = require('underscore');
var fb_url = 'http://dralexmv.firebaseio.com/';
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var firebase = require('firebase');
var dwolla = require('dwolla');
base_fb = new firebase(fb_url);

app = express();

//generate Dwolla credentials
var dw_cred = require('./controllers/dwolla').credentials;

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

require('./routes')(app);

