abbottApp.directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element, attrs) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue && attrs.addBrandClicked) {
                    $(element).scrollTop($(element)[0].scrollHeight);
                }
            });
        }
    }
});

abbottApp.directive('scrollPageUp', ['$rootScope', '$timeout',
function ($rootScope, $timeout) {
    return {
        restrict: 'A',
        scope: {
            scrollBodyClassName: "="
        },
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            element.bind('focus', function () {
                if ($rootScope.keyboardHeight != undefined) {
                    scope.keyboardShowHandler();
                }
            });

            element.bind("keydown keypress", function (event) {
                var keyCode = event.which || event.keyCode;

                // If enter key is pressed
                if (keyCode === 13) {
                    scope.$apply(function () {
                        cordova.plugins.Keyboard.close();
                    });

                    event.preventDefault();
                }
            });

            scope.moveBy = 0;
            scope.elementHeight = 0;
            scope.screenHeight = $(window).height();
            scope.isViewModified = false;
            scope.elementY = 0;
            scope.scrollElementY = 0;

            scope.scrollClassName = attrs.scrollPageUp;
            if ($('.navbar-static-top')[0] != undefined && $('.navbar-static-top')[0].clientHeight > 0) {
                scope.navBarHeight = $('.navbar-static-top')[0].clientHeight;
            }

            scope.keyboardShowHandler = function () {
                $timeout(function () {
                    if (isElementInViewport(element))
                        return;
                    scope.elementHeight = element.height();
                    scope.elementY = element.offset().top;
                    if (scope.scrollClassName.indexOf('ngdialog') != -1) {
                        scope.scrollElementY = $('.ngdialog-content').offset().top;
                    }
                    if ((scope.elementY + scope.elementHeight) < (scope.screenHeight - $rootScope.keyboardHeight)) {
                        return;
                    }

                    $('.navbar-static-top').css('display', 'none');
                    // get viewport height
                    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
					    elementY = element.offset().top,
					    offset = 0;
                    if (scope.scrollClassName.indexOf('ngdialog') != -1) {
                        offset = scope.elementHeight;
                    }
                    scrollTo = viewportHeight - ($rootScope.keyboardHeight + offset + scope.navBarHeight);
                    if (isiPad)
                        scrollTo = viewportHeight - ($rootScope.keyboardHeight + scope.navBarHeight);
                    if (scrollTo < elementY) {
                        scope.moveBy = scrollTo - elementY;
                    }

                    if (scope.scrollClassName.indexOf('ngdialog') != -1) {
                        $('.' + scope.scrollClassName).css('padding-top', scrollTo);
                    } else {
                        $('.' + scope.scrollClassName).css({
                            "-webkit-transform": "translate(0px, " + scope.moveBy + "px)"
                        });
                    }

                    scope.isViewModified = true;
                }, 100);
            };

            function isElementInViewport(el) {
                //special bonus for those using jQuery
                if (typeof jQuery === "function" && el instanceof jQuery) {
                    el = el[0];
                }
                var rect = el.getBoundingClientRect();

                return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - $rootScope.keyboardHeight) && /*or $(window).height() */
				rect.right <= ((window.innerWidth || document.documentElement.clientWidth) - $rootScope.keyboardHeight)
				);
            };

            scope.keyboardHideHandler = function () {
                scope.moveBy = 0;
                if (scope.isViewModified) {
                    $('.navbar-static-top').css('display', 'table');

                    if (scope.scrollClassName.indexOf('ngdialog') != -1) {
                        $('.' + scope.scrollClassName).css('padding-top', scope.scrollElementY);
                    } else {
                        $('.' + scope.scrollClassName).css({
                            "-webkit-transform": "translate(0px, 0px)"
                        });
                    }
                    element.blur();
                }
            };

            $rootScope.$on('keyboardHide', function (event, data) {
                scope.keyboardHideHandler();
            });

            $rootScope.$on('keyboardShow', function (event, data) {
                if ($rootScope.keyboardHeight == undefined) {
                    $rootScope.keyboardHeight = data.keyboardHeight;
                    scope.keyboardShowHandler();
                }
            });
        }
    };
}]);
