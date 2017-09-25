abbottApp.directive('onlyDigits', ['popupService', '$timeout', function (popupService, $timeout) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link:
         	function (scope, element, attr, ctrl) {
         	    function inputValue(val) {
         	        var trimmed = false;
         	        if (val.length > 10) {
                    val = val.slice(0,10);
                    trimmed = true;
         	        }
         	            var digits = val.replace(/[^0-9]/g, '');

         	            if (digits !== val || trimmed) {
         	                ctrl.$setViewValue(digits);
         	                ctrl.$render();
         	            }
         	            return parseInt(digits, 10);

         	        return undefined;
         	    }
         	    ctrl.$parsers.push(inputValue);
         	}
    };
}]);

abbottApp.directive('fileReader', ['$q', 'popupService', function ($q, popupService) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function () { }

            element.bind('change', function (e) {
                var element = e.target;
                if (!element.value) return;

                var ext = element.value.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[1];
                switch (ext.toLowerCase()) {
                    case 'jpg':
                    case 'bmp':
                    case 'png':
                    case 'jpeg':
                    case 'pdf':
                        break;
                    default:
                        popupService.openPopup('Only Pdf and images are allowed for upload.', 'OK', '35%', function () { });
                        element.value = null;
                        return;
                }
                if(element.files[0].size > 2*1024*1024){
                    popupService.openPopup('Please upload file less than 2 MB', 'OK', '35%', function () { });
                    element.value = null;
                    return;
                }

                //element.disabled = true;
                $q.all(slice.call(element.files, 0).map(readFile))
                  .then(function (values) {
                      if (element.multiple) ngModel.$setViewValue(values);
                      else ngModel.$setViewValue(values.length ? values[0] : null);
                      //                          element.value = null;
                      //                          element.disabled = false;
                  });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader()
                    reader.onload = function (e) {
                        deferred.resolve(e.target.result);
                    }
                    reader.onerror = function (e) {
                        deferred.reject(e);
                    }
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            });
        }
    };
}]);
