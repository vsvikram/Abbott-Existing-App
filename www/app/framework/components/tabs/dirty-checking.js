// directive which check form for any unsaved data on locationchange and tab-leave
// alert User for unsaved data
//TODO show toastMessages from directive and auto save data.

abbottApp.directive('dirtyTracking', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            function isDirty() {
                var formObj = scope[elem.attr('name')];
                return formObj && formObj.$pristine === false;
            }

            function areYouSurePrompt() {
                if (isDirty()) {
                    return alert('You have unsaved changes. Are you sure you want to leave this page?');
                }
            }

            $window.addEventListener('beforeunload', areYouSurePrompt);

            elem.bind("$destroy", function () {
                $window.removeEventListener('beforeunload', areYouSurePrompt);
            });

            scope.$on('$locationChangeStart', function (event) {
                // var formName = elem.attr('name');
                // //var form = args.form;
                // if (isDirty()) {
                // var formObj = scope[elem.attr('name')];
                // formObj.tabChange = true;
                // var subFn = elem.attr('ng-submit');
                // scope.$eval(subFn, {frm: formObj});
                // }
            });

            scope.$on('tab-leave', function (event, args) {
                var formName = elem.attr('name');
                var form = args.form;
                if (formName == form && isDirty()) {
                    var formObj = scope[elem.attr('name')];
                    formObj.tabChange = true;
                    var subFn = elem.attr('ng-submit');
                    scope.$eval(subFn, { frm: formObj });
                }
            });

            scope.$on('form-validated', function (event, args) {
                $(elem[0]).addClass("ng-submitted");
            });
        }
    };
}]);
