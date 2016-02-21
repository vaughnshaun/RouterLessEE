var utilities = require('./RouterLessEE-Utilities.js');
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
exports.AccessDeniedError = AccessDeniedError;