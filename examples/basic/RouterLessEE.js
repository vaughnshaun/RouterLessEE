var cachedModules=[];
cachedModules[5429]={exports:{}};
(function(module,exports) {var jpg = {
	contentType: 'image/jpeg'
};
var defs = {
	ico: {
		contentType: 'image/x-icon'
	},
	html: {
		contentType: 'text/html'
	},
	js: {
		contentType: 'text/javascript'
	},
	css: {
		contentType: 'text/css'
	},
	json: {
		contentType: 'application/json'
	},
	jpg: jpg,
	jpeg: jpg,
	png: {
		contentType: 'image/png'
	},
	gif: {
		contentType: 'image/gif'
	},
	ico: {
		contentType: 'image/x-icon'
	}
};

exports.getFields = function(){
	var finalObj = {};
	
	for(var key in defs){
		finalObj[key] = {};
		finalObj[key].contentType = defs[key].contentType;
	}
	
	return finalObj;
};}).call(this,cachedModules[5429],cachedModules[5429].exports);
cachedModules[8546]={exports:{}};
(function(module,exports) {// A shallow copy of an array. This is get for copying arrays that contains primitives
function cloneArray(arr, formatCallback, includeEmpty, isValidCallback){
	var result = [];
	
	if(formatCallback){
		for(var i = 0; i < arr.length; i++){
			if(arr[i] || includeEmpty){
				var val = formatCallback(arr[i]);
				
				// Determine if the value should be include in the array or not
				if(!isValidCallback || isValidCallback(arr, val)){
					result[result.length] = val; 
				}
			}
		}
	}
	else{
		for(var i = 0; i < arr.length; i++){
			if(arr[i] || includeEmpty){
				var val = arr[i];
				// Determine if the value should be include in the array or not
				if(!isValidCallback || isValidCallback(arr, val)){
					result[result.length] = val; 
				}
			}
		}	
	}
	
	return result;
}

// Determines if a terminator is at the beginning of a string
function isTerminatorAtStart(str, terminator){
	terminator = terminator || '';
	str = str || '';
	var length = terminator.length;
	
	var isEqual = true;
	for(var i = 0; i < length && isEqual; i++){
		if(terminator[i] != str[i]){
			isEqual = false;
		}
	}
	
	return isEqual;
}

// Removes the first delimiter/terminator from a string
function removeFirstDelimiter(str, terminator){
	var newStr = str;
	
	if(newStr && isTerminatorAtStart(newStr, terminator)){
		newStr = newStr.substring(terminator.length);
	}
	
	return newStr;
}

// source - The source object to copy
// def - The default object that has the default values and all of the valid keys
function copyObjWithDefs(source, def){
	var result;
	
	// If the source to copy is not undefined process it. Otherwise the result should return undefined or the default if the default is a primitive
	if(source !== undefined){
		// If source is not a primitive, we need to use recursion
		if(typeof source == "object"){
			// If the object is an array, call the function again for each element in the array
			if(source instanceof Array){
				result = []; // The destination array
				var arrayVal;
				
				// Make sure that the current defaults object matches the type of the source
				def = !(def instanceof Array) ? [] : def;
				var arrayCount = source.length > def.length ? source.length : def.length;
				for(var i = 0; i < arrayCount; i++){
					// Do not enter an undefined element
					arrayVal = source[i];
					if(arrayVal === undefined){
						arrayVal = def[i];
					}
					
					// Copy the array value into the destination object, but use recursion to make sure the value is not another object
					if(arrayVal){
						// Pass the array value to assign and the new default value
						result[i] = copyObjWithDefs(arrayVal, def[i]);
					}
				}
			}
			else{ // The source is a key value pair
				result = {};
				
				// Make the default object mirror the source object
				def = !(def instanceof Object) ? {} : def;
				
				// Loop through each key in the source object first
				var objVal;
				var isDupKey = {};
				for(var key in source){
					// If the source value is undefined, get the value from the default
					objVal = source[key];
					if(objVal === undefined){
						objVal = def[key];
					}
					isDupKey[key] = true;
					// Recurse through the object
					result[key] = copyObjWithDefs(objVal, def[key]);
				}
				
				// Loop through all the keys in the default object that have not been processed yet
				for(var key in def){
					if(!isDupKey[key]){
						// This second pass should always be non processed defaults because the source keys were already fully processed
						result[key] = copyObjWithDefs(def[key], def[key]);
					}
				}
			}
		}
		else{ // The source is a primitive
			result = source || def;
		}
	}
	else if(def !== undefined){ // Process the default object if the source is undefined
		result = copyObjWithDefs(def, def);
	}
	
	return result;
}

function binarySearch(arr, val){
	var index = -1;
	var first = 0;
	var last = arr.length - 1;
	var middle = (first + last) / 2;
	var midVal;
	
	while(first <= last && index == -1){
		midVal = arr[middle];
		if(val < midVal){
			last = middle - 1;
		}
		else if(val > midVal){
			first = middle + 1
		}
		else{
			index = middle;
		}
		
		middle = (first + last) / 2;
	}
	
	return index;
}

exports.isTerminatorAtStart = isTerminatorAtStart;
exports.removeFirstDelimiter = removeFirstDelimiter;
exports.copyObjWithDefs = copyObjWithDefs;
exports.cloneArray = cloneArray;
exports.binarySearch = binarySearch;

/*exports = {
	isTerminatorAtStart: isTerminatorAtStart,
	removeFirstDelimiter: removeFirstDelimiter,
	copyObjWithDefs: copyObjWithDefs,
	cloneArray: cloneArray,
	binarySearch: binarySearch
};*/}).call(this,cachedModules[8546],cachedModules[8546].exports);
cachedModules[4233]={exports:{}};
(function(module,exports) {var utilities = cachedModules[8546].exports;
var cloneArray = utilities.cloneArray;
var binarySearch = utilities.binarySearch;
var allMethod = 'SJV-all';

function cloneStringArrFormatter(val){
	val = val === undefined ? '' : val;
	val = val.toLocaleLowerCase();
}

function cloneHandlerFormatter(handler){
	return {
		method: cloneStringArrFormatter(handler.method),
		path: cloneStringArrFormatter(handler.path)
	}
}

function isCloneStringArrValid(arr, val){
	return arr.indexOf(val) > -1;
}

var defaultConfig = {
	restricted:{
		files: [],
		handlers: [],
		handlerMethods: []
	},
	isAuthCallbacks: []
};

function Security(config){
	this._rFiles;
	this._rHandlers;
	this._rHandlerMethods;
	this._isRestrictedCallbacks;
	
	config = config || {};
	config.restricted = config.restricted || defaultConfig;
	config.isRestrictedCallbacks = config.isRestrictedCallbacks || defaultConfig.isRestrictedCallbacks;
	
	this.setRestrictedFiles(config.restricted.files);
	this.setRestrictedMethods(config.restricted.handlersMethods);
	this.setRestrictedHandlers(config.restricted.handlers);
}

// Determines if a file is accessible
Security.prototype.isFileAccessible = function(file){
	return binarySearch(this._rFiles, file) == -1;
};

Security.prototype.isMethodAccessible = function(method){
	var isAccessible = true;
	
	if(method){
		method = method.toLocaleLowerCase();
		isAccessible = binarySearch(this._rHandlerMethods, method) == -1;
	}
	
	return isAccessible;
};

// Determines if a particular handler is accessible. This is determined by the method and path
Security.prototype.isHandlerAccessible = function(handlerConfig){
	var isAccessible = true;
	handlerConfig = handlerConfig || {};
	
	if(handlerConfig.path){
		handlerConfig.method = handlerConfig.method || allMethod;

		// Compares a list of restricted paths to the passed in path
		isAccessible = binarySearch(this._rHandlers[handlerConfig.method.toLocaleLowerCase()], handlerConfig.path.toLocaleLowerCase()) == -1;
	}
	
	return isAccessible;
};

// Determines if the routing is accessible at all. This is determined by the user callbacks
Security.prototype.isAccessible = function(){
	var isRestricted = false;
	for(var i = 0; i < this._isRestrictedCallbacks.length && !isRestricted; i++){
		isRestricted = this._isRestrictedCallbacks[i]();
	}
	
	return isRestricted;
};

// Set the files that should be restricted
Security.prototype.setRestrictedFiles = function(files){
	files = files || [];
	this._rFiles = cloneArray(files, cloneStringArrFormatter, false, isCloneStringArrValid);
	this._rFiles.sort();
};

// Set the handler methods that should be restricted
Security.prototype.setRestrictedMethods = function(methods){
	methods = methods || [];
	this._rHandlerMethods = cloneArray(methods, cloneStringArrFormatter, false, isCloneStringArrValid);
	this._rHandlerMethods.sort();
};

// Set the restricted handlers
Security.prototype.setRestrictedHandlers = function(handlers){
	handlers = handlers || [];
	
	var curHandler;
	var curMethod;
	var curPath;
	
	// Separate the paths in separate lists based on the method
	for(var i  = 0; i < handlers.length; i++){
		curHandler = handlers[i];
		if(curHandler){
			// Each method should have their array of paths
			curMethod = curHandler.method || allMethod;
			curMethod = curMethod.toLocaleLowerCase();
			curPath = curHandler.path || '';
			curPath = curPath.toLocaleLowerCase();
			
			// The path should be added only if it exist
			if(curPath){
				// Check to see if a new path list has to be created based on the path
				if(this._rHandlers[curMethod]){
					this._rHandlers[curMethod] = [];
				}
				
				this._rHandlers[curMethod][this._rHandlers[curMethod].length] = curPath
			}
		}
	}
	
	// Sort each method's list
	for(var key in this._rHandlers){
		this._rHandlers[key].sort(function(a, b){
			var result = 0;
			
			// Order by method first
			if(a.path < b.path){
				result = -1;
			}
			else if(a.path > b.path){
				result = 1;
			}
			
			return result;
		});
	}
};

// Set the user custom restrictions
Security.prototype.setCustomRestrictions = function(restrictionCallbacks){
	restrictionCallbacks = restrictionCallbacks || [];
	this._isRestrictedCallbacks = cloneArray(restrictionCallbacks);
};

function AccessDeniedError(message){
	this.name = 'AccessDenied';
	this.message = message || 'Access Denied';
	this.stack = (new Error()).stack;
}

AccessDeniedError.prototype = Object.create(Error.prototype);
AccessDeniedError.prototype.constructor = Error;

exports.getSecurity = function(config){ return new Security(config);};
exports.AccessDeniedError = AccessDeniedError;}).call(this,cachedModules[4233],cachedModules[4233].exports);// Required Modules
var url = require('url');
var queryString = require('querystring');
var path = require('path');
var fs = require('fs'); // The file system module
var fieldDefs = cachedModules[5429].exports;
fieldDefs = fieldDefs.getFields();
var utilities = cachedModules[8546].exports;
var security = cachedModules[4233].exports;
var removeFirstDelimiter = utilities.removeFirstDelimiter;
var copyObjWithDefs = utilities.copyObjWithDefs;
var globalEvent;
var AccessDeniedError = security.AccessDeniedError;
var defaultHttp = require('http');

/********** Class Objects *******************/
// Default dispatcher config
var defaultConfig = {
	view: {
		exts: ['html', 'htm'],
		suffix: ['.html', '.html'],
		prefix: 'pages'
	},
	port: 8080,
	cache: false
};

function getNoCache(){
	return {
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		Pragma: 'no-cache',
		Expires: 0
	};
}

// This gets the appropriate content headers based on caching/no caching
function getBaseContentHeaders(cache){
	var headers = {};
	if(!cache){
		headers = getNoCache();
	}
	
	return headers;
}

function Event(){
	this._unnamedHandlers = []; // Saves an array of unnamed handlers
	this._namedHandlers = {}; // Saves a map of arrays of handlers by eventName:[handler]
	this._parents = {}; // Saves the parent by eventName:parent
	this._globalParent;
}

Event.extractParameters = function(nameOrTarget, nameOrHandler, handler){
	var evtObj = {};
	
	// Extract the event name or event target
	if(typeof nameOrTarget == 'string'){
		evtObj.eventName = nameOrTarget;
	}
	else{
		evtObj.eventTarget = nameOrTarget;
	}
	
	// Extract the event name or event handler
	if(!evtObj.eventName){
		if(typeof nameOrHandler == 'string'){
			evtObj.eventName = nameOrHandler;
		}
		else{
			evtObj.eventHandler = nameOrHandler;
		}
	}
	
	// Extract the handler
	if(!evtObj.eventHandler){
		evtObj.eventHandler = handler;
	}
	
	if(evtObj.eventName){
		evtObj.eventName = evtObj.eventName.toLocaleLowerCase();
	}
	
	return evtObj;
};

Event.prototype.on = function(nameOrTarget, nameOrHandler, handler, parent){
	var params = Event.extractParameters(nameOrTarget, nameOrHandler, handler);
	var eventName = params.eventName;
	var eventTarget = params.eventTarget;
	var eventHandler = params.eventHandler;
	
	// Update the handlers for the child otherwise update the handlers for the parent
	if(eventTarget){
		this.on.call(eventTarget, eventName, eventHandler);
	}
	else{
		// If the event name is present, try to bind the handler
		if(eventName && eventHandler){
			if(!this._namedHandlers[eventName]){
				this._namedHandlers[eventName] = [];
			}
			
			// Add the event handler if the handler has not be added yet
			if(this._namedHandlers.indexOf(eventHandler) == -1){
				var index = this._namedHandlers[eventName].length;
				this._namedHandlers[eventName][index] = eventHandler;
			}
		}
		else if(eventHandler && this._unnamedHandlers.indexOf(eventHandler)){
			this._unnamedHandlers[this._unnamedHandlers.length] = eventHandler;
		}
		
		//var parent = Event.prototype.on.caller;
		if(parent && parent != this){
			if(eventName){
				this._parents[eventName] = parent;
			}
			else{
				this._globalParent = parent;
			}
		}
	}
};

Event.prototype.trigger = function(eventName, data){
	// If an event name exist and has handlers then process all the handlers for that event
	if(eventName && this._namedHandlers[eventName]){
		var handlers = this._namedHandlers[eventName];
		for(var i = 0; i < handlers.length; i++){
			handlers[i](this, data);
		}
		
		// If this event has a parent then process the parent event
		if(this._parents[eventName]){
			this._parents[eventName].trigger(eventName, data);
		}
	}
	else{ // Otherwise process all of the unnamed handlers
		for(var i = 0; i < this._unnamedHandlers.length; i++){
			this._unnamedHandlers[i](this, data);
		}
	}
};

globalEvent = new Event();

function createEventInterface(obj){
	obj.prototype.on = function(nameOrTarget, nameOrHandler, handler, parent){
		if(this._event){
			this._event.on(nameOrTarget, nameOrHandler, handler, parent);
		}
	};
	
	obj.prototype.off = function(){
		this._event.off();
	};
	
	obj.prototype.trigger = function(eventName){
		this._event.trigger(eventName);
	};
}

function doEventMixin(obj, event){
	if(obj && event){
		obj.on = function(nameOrTarget, nameOrHandler, handler, parent){
			event.on(nameOrTarget, nameOrHandler, handler, parent);
		};
	
		obj.off = function(){
			event.off();
		};
		
		obj.trigger = function(eventName){
			event.trigger(eventName);
		};
	}
}

// Dispatcher - This has the basic setup for routing
function Dispatcher(server){
	this._server = server;
	this._security;
	this._controllers = [];
	
	//Initial dispatching logic goes here. Loop through all of the controllers to process the request
}

// Adds a controller to be watched by the dispatcher
Dispatcher.prototype.addController = function(c){
	if(!(c instanceof Controller)){
		throw new Error("Cannot add non controller objects to the dispatcher's list of controllers.");
	}
	
	// Add controllers only if they exist and have not been added already
	if(c && this._controllers.indexOf(c) == -1){
		this._controllers[this._controllers.length] = c;

		// Check to see if a handlers is accessible before it gets processed
		globalEvent.on('beforeHandlerProcess', function(evt, data){
			if(!this._security && !this._security.isHandlerAccessible(data)){
				throw new AccessDeniedError();
			}
		});
	}
};

// Sets the security that the dispatcher should use
Dispatcher.prototype.setSecurity = function(sec){
	this._security = sec;
};

Dispatcher.prototype.getSecurity = function(){
	return this._security;
};

Dispatcher.prototype.setServer = function(server){
	this._server = server;
};

Dispatcher.prototype.getServer = function(server){
	this._server = server;
};

Dispatcher.prototype.getControllerCount = function(){
	return this._controllers.length;
};

Dispatcher.prototype.getControllerByIndex = function(index){
	return this._controllers[index];
};

// DispatcherServer - This handles all of the routing
function DispatcherServer(config){
	this._config = copyObjWithDefs(config, defaultConfig);
	var http = this._config.protocol || defaultHttp; // Gets the proper http protocol.
	this._dispatcher = new Dispatcher();
	var dispatcher = this;
	// Create the http server and pass the dispatcher main logic function
	var server = http.createServer(function(req, res){
		DoDispatch(dispatcher, req, res);
	}).listen(this._config.port);

	// Pass the security and the server
	this._dispatcher.setSecurity(this._config.security);
	this._dispatcher.setServer(server);
}

// The current configuration of the dispatcher server
DispatcherServer.prototype.getConfig = function(){
	return this._config;
};

DispatcherServer.prototype.getControllerCount = function(){
	return this._dispatcher.getControllerCount();
};

DispatcherServer.prototype.getControllerByIndex = function(index){
	return this._dispatcher.getControllerByIndex(index);
};

DispatcherServer.prototype.addController = function(c){
	if(c){
		this._dispatcher.addController(c);
	}
};

DispatcherServer.prototype.setSecurity = function(sec){
	this._dispatcher.setSecurity(sec);
};

DispatcherServer.prototype.getSecurity = function(){
	return this._dispatcher.getSecurity();
};

// Controller - Processes handler methods based on the path and method
function Controller(handlers){
	handlers || [];
	this._handlers = [];
	
	for(var i = 0; i < handlers.length; i++){
		this._handlers[this._handlers.length] = handlers[i];
	}
}

// Picks the right handler to process the request. The config is the default config if none exist
Controller.prototype.processHandler = function(req, res, config){
	var isFound = false;
	var handler;
	var pathObj = getPathByRequest(req);
	var variables = {};
	
	config = config || defaultConfig;
	
	// Find the handler by the passed in path
	for(var i = 0; i < this._handlers.length && !isFound; i++){
		handler = this._handlers[i];
		globalEvent.trigger('beforeHandlerProcess', {handler: {path: handler.path, method: handler.method}});
		isFound = doesHandlerMatchPath(pathObj.path, handler.path, variables) && handler.method == req.method;
	}
	
	// Process the handler if the handler is found
	var returnObj;

	if(isFound){

		// The expected return type of the handler
		var handlersReturnType = (handler.returnType || '').toLocaleLowerCase();

		// Get the caching flag from the config
		var hasCaching = config.cache;

		// Override the global cache config with the handler specific cache config
		if(handler.cache !== undefined){
			hasCaching = handler.cache;
		}

		// Look for the page file. This will make the path relative to the url path and not the actual location of the page file
		if(handlersReturnType == 'string' || handlersReturnType == 'viewname'){
			// Process the handler function and catch its results
			var handlerResults = handler.process(req, res, variables.variables) || '';
			
			// Throw an error if a string is not being passed
			if(typeof handlerResults != "string"){
				throw new Error("Return type not a string. The expected return type of the handler is a string.");
			}

			// Pass the string to get the view name
			var finalView = getFullViewPath(handlerResults, config, 1);
			loadFile(finalView, getDefinitionType(pathObj.pathExt), res, getBaseContentHeaders(hasCaching));
		}
		else if(handlersReturnType == 'object'){ // The model view
			handler.process(req, res, variables.variables);
		}
		else{ // If the return type is undefined then process the standard logic
			// Write the response header
			var responseHeader = handler.responseHeader || {};
			responseHeader.content = responseHeader.content || {};

			// Get the no cache headers if they are available
			var cacheHeaders = getBaseContentHeaders(hasCaching);
			if(cacheHeaders['Cache-Control']){
				responseHeader.content['Cache-Control'] = cacheHeaders['Cache-Control'];
				responseHeader.content['Pragma'] = cacheHeaders['Pragma'];
				responseHeader.content['Expires'] = cacheHeaders['Expires'];
			}

			// Write the response head
			res.writeHead(responseHeader.code || 200, responseHeader.content);

			// Prevent the users from writing to the head a second type
			var writeHead = res.writeHead;
			res.writeHead = undefined;
			//res.writeHead = function(){};

			// Process the handler logic
			handler.process(req, res, variables.variables);
			
			// Attach the writeHead back to the response instance after the handler logic has been executed
			res.writeHead = writeHead; // Attach the function back
			res.end();
		}
	}
	
	return isFound;
};

/********* Utilities ************/
// Gets the full path based on the view name
function getFullViewPath(viewName, config, index){
	var suffix = config.view.suffix[index] || config.view.suffix[0];
	return '/' + config.view.prefix + '/' + viewName + suffix;
}

function loadFile(path, type, res, resHeaders, security){
	// Asynchronous read of a file
	// Open the file
	if(!security || security.isFileAccessible(path)){
		if(type){
			fs.readFile('.' + path, function (err, data) {	
				// If there are no errors end the response and return the content from the file
				if(err){
					resHeaders['content-type'] = type;
					res.writeHead(404, resHeaders);
					res.end();
				}
				else{
					// Tell the browser the type of data to expect
					resHeaders['content-type'] = type;
					res.writeHead(200, resHeaders);
					// Fill the response with the data from the file
					res.end(data);
				}
			});
		}
		else{
			resHeaders['content-type'] = 'text/html';
			res.writeHead(400, resHeaders);
			res.end();
		}		
	}
	else{
		doResponseDenied(res);
	}
}

function doResponseDenied(res){
	res.writeHead(401, {'content-type': 'text/html'});
	res.end('Access Denied');
}

// The main method that determines where the request should be dispatched to
function DoDispatch(dispatcher, req, res){
	var count = dispatcher.getControllerCount();
	var curCon;
	var isProcessed = false;
	var security = dispatcher.getSecurity();
	
	var pathObj = getPathByRequest(req);

	// If the caching is turned off then prevent caching
	if(dispatcher.getConfig().noCache === false){
		
	}
	
	// If security is enabled do all of the initial security checks (request method and user defined security functions)
	if(security && (!security.isMethodAccessible(req.method) || !security.isAccessible())){
		doResponseDenied(res);
	}
	else{
		// Keep looping through the controllers until a handler has been processed
		try{
			for(var i = 0; i < count && !isProcessed; i++){
				curCon = dispatcher.getControllerByIndex(i);
				isProcessed = curCon.processHandler(req, res, dispatcher.getConfig());
			}
			
			// Run the standard file retrieve if none of the handlers process the request
			if(!isProcessed){
				loadFile(pathObj.path, getDefinitionType(pathObj.pathExt), res, getBaseContentHeaders(dispatcher.getConfig().cache), security);
			}
		}
		catch (e){
			if(e instanceof AccessDeniedError){
				doResponseDenied(res);
			}
			else{
				throw e;
			}
		}
	}
}

function getDefinitionType(ext){
	var type = '';
	var resultDef = fieldDefs[ext];
	if(resultDef){
		type = resultDef.contentType;
	}
	
	return type;
}

// Gets the path object. This returns the parsed query parameters and path info.
function getPathByRequest(req){
	// url.parse does not auto decode, pass true to automatically parse the query string using the queryString module
	// The queryString parser automatically decodes the string
	var obj = url.parse(req.url, true);
	var pathName = queryString.unescape(obj.pathname);
	
	var ext = path.extname(pathName);
	
	if(ext[0] == '.'){
		ext = ext.substring(1);
	}
	
	return {
		query: obj.query,
		path: pathName, // Get the decoded path name
		pathBase: path.basename(pathName),
		pathExt: ext
	};
}

var pathTerminator = '/';

// Determines if the handlers path matches the requested path
function doesHandlerMatchPath(path, handlerPath, outVars){
	
	path = (path || '').toLocaleLowerCase();
	handlerPath = (handlerPath || '').toLocaleLowerCase();
	var newPath = removeFirstDelimiter(path, pathTerminator);
	var newHandlerPath = removeFirstDelimiter(handlerPath, pathTerminator) ||'';
	
	// Remove the variable place holders from the handler path
	var varNames = newHandlerPath.match(new RegExp("{.+?}", 'g'), "") || [];
	var resultVars = {};
	//newHandlerPath = newHandlerPath.replace(new RegExp("{.+?}", 'g'), "");
	
	// Split both strings
	newPath = newPath.split(pathTerminator);
	newHandlerPath = newHandlerPath.split(pathTerminator);
	
	var isEqual = newPath.length == newHandlerPath.length;
	
	// Compare each of paths' tokens if each path has the same number of tokens
	var varCounter = 0;
	var dupVarName = {};
	for(var i = 0; i < newPath.length && isEqual; i++){
		// if the handler token has nothing, it is a place holder
		isEqual = newHandlerPath[i] == newPath[i];
		
		// If the current tokens aren't equal then check the list of variables
		if(!isEqual){
			isEqual = varNames[varCounter] !== undefined;
			
			// Save the var path value to the object if there is an available key
			if(isEqual){
				var name = varNames[varCounter];
				
				// If the path variable has already been added then throw an error
				if(dupVarName[name]){
					throw new Error("Paths that have duplicate named path variables are not allowed.");
				}
				
				dupVarName[name] = true;
				name = name.substring(1, name.length - 1);
				resultVars[name] = newPath[i];
			}
			varCounter++;
		}
	}
	
	// If the user passed in an outVars object then store the variables into the out object
	if(outVars){
		outVars.variables = resultVars;
	}
	
	return isEqual;
}

var dispatcherMap = {};
exports.getDispatcherServer = function(name, config){

	// Only create if the dispatcher does not exist or a new config is passed
	if(!dispatcherMap[name] || config){
		dispatcherMap[name] = new DispatcherServer(config);
	}
	
	return dispatcherMap[name];
};

var controllerMap = {};
exports.getController = function(name, handlers){

	// Create if the controller doesn't exist or you are adding new handlers
	if(!controllerMap[name] || config){
		controllerMap[name] = new Controller(handlers);
	}
	
	return controllerMap[name];
};