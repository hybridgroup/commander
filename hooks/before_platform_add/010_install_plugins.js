#!/usr/bin/env node
 
//this hook installs all your plugins
 
// add your plugins to this list--either 
// the identifier, the filesystem location 
// or the URL
console.log('--------------------------------------');
console.log("==========Installing Plugins==========");
console.log('--------------------------------------');
 
var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

var rootdir = process.argv[2];

var configobj = JSON.parse(fs.readFileSync("plugins.json", 'utf8'));
console.log(configobj.plugins)
var pluginlist = configobj.plugins;
 
function puts(error, stdout, stderr) {
  sys.puts(stdout)
}
 
pluginlist.forEach(function(plug) {
  exec("cordova plugin add " + plug, puts);
});
