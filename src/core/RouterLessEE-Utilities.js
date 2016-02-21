// A shallow copy of an array. This is get for copying arrays that contains primitives
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
};*/