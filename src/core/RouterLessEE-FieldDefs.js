var jpg = {
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
};