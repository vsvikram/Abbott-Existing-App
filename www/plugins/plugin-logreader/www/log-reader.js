cordova.define("plugin-logreader.log-reader", function(require, exports, module) {
var exec = require('cordova/exec');

function LogReader(){}

LogReader.prototype.printLog = function (successCallback, errorCallback, action) {
  exec(
    successCallback, // success callback function
    errorCallback, // error callback function
    'LogReader', // mapped to our native Java class called
    "open", // with this action name , in this case 'beep'
    [] );// arguments, if needed
};

module.exports = new LogReader();
});
