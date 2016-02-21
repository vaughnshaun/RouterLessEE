// An Person Class
function Person(name){
	this._name = name;
}

Person.prototype.setName = function(name){
	this._name = name;
};

Person.prototype.getName = function(){
	return this._name;
};

// An Employee Class
function Employee(){

}

Employee.prototype = new Person();
Employee.prototype.toString = function(){
	return this._name;
};