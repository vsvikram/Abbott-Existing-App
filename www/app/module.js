var abbottApp = angular.module('AbbottMobile', ['ui.router', 'angularMoment', 'ngMaterial', 'ngStorage','ngDialog', 'ui.calendar', 'rzModule', 'chart.js','ridge','media',
                                                                                                                        'ngCordova','hmTouchEvents','ngScrollable', 'angular-svg-round-progressbar','ui.bootstrap']);

abbottApp.directive('abbottTouchstart', [
function() {
	return function(scope, element, attr) {

		element.on('touchstart', function(event) {
			scope.$apply(function() {
				scope.$eval(attr.abbottTouchstart);
			});
		});
	};
}]).directive('abbottTouchend', [
function() {
	return function(scope, element, attr) {

		element.on('touchend', function(event) {
			scope.$apply(function() {
				scope.$eval(attr.abbottTouchend);
			});
		});
	};
}]).directive('onLongPress', function($timeout) {
   	return {
   		restrict: 'A',
   		link: function($scope, $elm, $attrs) {
   			$elm.bind('touchstart', function(evt) {
   				// Locally scoped variable that will keep track of the long press
   				$scope.longPress = true;

   				// We'll set a timeout for 600 ms for a long press
   				$timeout(function() {
   					if ($scope.longPress) {
   						// If the touchend event hasn't fired,
   						// apply the function given in on the element's on-long-press attribute
   						$scope.$apply(function() {
   							$scope.$eval($attrs.onLongPress)
   						});
   					}
   				}, 600);
   			});

   			$elm.bind('touchend', function(evt) {
   				// Prevent the onLongPress event from firing
   				$scope.longPress = false;
   				// If there is an on-touch-end function attached to this element, apply it
   				if ($attrs.onTouchEnd) {
   					$scope.$apply(function() {
   						$scope.$eval($attrs.onTouchEnd)
   					});
   				}
   			});
   		}
   	};
   });

abbottApp.config(function($cordovaInAppBrowserProvider) {

  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  };

  document.addEventListener("deviceready", function () {

    $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions)

  }, false);
});
