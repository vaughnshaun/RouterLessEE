var NodeUglifier = require("node-uglifier");
var nodeUglifier = new NodeUglifier("../../examples/basic/Routing-Driver.js");
//nodeUglifier.merge();
nodeUglifier.merge().uglify();
 
//exporting 
nodeUglifier.exportToFile("../../examples/basic/Routing-Driver-works.js");
//nodeUglifier.exportSourceMaps("lib_compiled/test/resultFiles/sourcemaps/simpleMergeAndUglify.js");
//DONE 
 
//in case you need it get the string 
//if you call it before uglify(), after merge() you get the not yet uglified merged source 
//var uglifiedString=nodeUglifier.toString();