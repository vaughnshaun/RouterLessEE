var dispatcher = require('./RouterLessEE.js');
//var controller = require('./MyController.js');
var homeController = require('./controllers/HomeController.js');

var myDispatcher = dispatcher.getDispatcherServer('myDispathcer');
myDispatcher.addController(homeController.controller);