'use strict';

var $doc = $(document);
var $win = $(window);

// Run functions from given array
var run = function(array) {
	array.forEach(function(fnc) {
		fnc($);
	});
};
// Trigger on dom ready actions
$(function(){
	run(window.onDomReady);
});
// Trigger on document load actions
$win.on('load', function() {
	run(window.onDomLoad);
});