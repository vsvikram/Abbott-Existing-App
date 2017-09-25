/**
 * Utility service to call popups in the screen
 */
abbottApp.service('popupService', ['ngDialog', '$interval', '$window', '$timeout',

function popupService(ngDialog, $interval, $window, $timeout) {
	this.isPopupDisplayed = false;
	var self = this;
	var setPopup = function(width, height) {
		var loaded = $interval(function() {

			var inspectElement = document.getElementsByClassName('ngdialog-content');

			if (loaded.$$state.value !== 'canceled' && inspectElement.length > 0) {
				$interval.cancel(loaded);

				inspectElement[0].style.display = 'block';

				if (width)
					inspectElement[0].style.width = width;
				if(height)
					inspectElement[0].style.height = height;

				var y = ($window.innerHeight - inspectElement[0].clientHeight) / 2;
				y = y > 150 ? 125 : y;
				inspectElement[0].parentElement.style.paddingTop = '' + y + 'px';
			}
		}, 1000);
	};

	/**
	 * Function to open Confirmation popup
	 * @param headerText: 		Header text
	 * @param bodyText: 		content text
	 * @param negativeButton: 	Negative button text
	 * @param bodyText: 		Positive button text
	 * @param negativeCallback: Callback function on Negative button click
	 * @param positiveCallback: Callback function on Positive button click
	 */
	this.openConfirm = function(headerText, bodyText, negativeButton, positiveButton, width, negativeCallback, positiveCallback, timeoutTime) {
		ngDialog.close();
		
		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}
		if(!self.isPopupDisplayed) {
			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.openConfirm({
					template : 'app/framework/components/popup/confirmPopup.html',
					data : {
						headerText : headerText,
						bodyText : bodyText,
						positiveButton : positiveButton,
						negativeButton : negativeButton
					},
					className : 'ngdialog-theme-default'
				}).then(function(value) {
					self.isPopupDisplayed = false;
					if (positiveCallback)
						positiveCallback();
				}, function(reason) {
					self.isPopupDisplayed = false;
					if (negativeCallback)
						negativeCallback();
				});
		
				setPopup(width);
			}, timeoutTime);			
		}
	};
this.DCRPopup = function(headerText,content,negativeButton, positiveButton, width, negativeCallback, positiveCallback, timeoutTime) {
        		ngDialog.close();

        		if(timeoutTime == undefined) {
        			timeoutTime = 0;
        		}
        		if(!self.isPopupDisplayed) {
        			self.isPopupDisplayed = true;
        			$timeout(function() {
        				self.removePopupElement();
        				ngDialog.openConfirm({
        					template : 'app/framework/components/popup/dcrPopup.html',
        					data : {

        						headerText : headerText,
        						lists : content,
                                positiveButton : positiveButton,
        						negativeButton : negativeButton
        					},
        					className : 'ngdialog-theme-default'
        				}).then(function(value) {
        					self.isPopupDisplayed = false;
        					if (positiveCallback)
        						positiveCallback();
        				}, function(reason) {
        					self.isPopupDisplayed = false;
        					if (negativeCallback)
        						negativeCallback();
        				});

        				setPopup(width);
        			}, timeoutTime);
        		}
        	};
        	
	this.openProgress = function(scope, width){
          ngDialog.close();

          if(!self.isPopupDisplayed){
            //self.isPopupDisplayed = true;
            self.removePopupElement();
            ngDialog.openConfirm({
              template: 'app/framework/components/popup/progressPopup.html',
              scope: scope,
              className: 'ngdialog-theme-default'
            }).then(function(value){
              self.isPopupDisplayed = false;
            }, function(reason){
              self.isPopupDisplayed = false;
            });

            setPopup(width);
          }
    };

    this.openConfirmWithTemplateUrl = function(scope, url, width, height){
          ngDialog.close();

          if(!self.isPopupDisplayed){
            //self.isPopupDisplayed = true;
            self.removePopupElement();
            ngDialog.openConfirm({
              template: url,
              scope: scope,
              className: 'ngdialog-theme-default'
            }).then(function(value){
              self.isPopupDisplayed = false;
            }, function(reason){
              self.isPopupDisplayed = false;
            });

            setPopup(width, height);
          }
    };

	/**
	 * Function to open Disclaimer popup
	 * @param headerText: 		Header text
	 * @param negativeButton: 	Negative button text
	 * @param bodyText: 		Positive button text
	 * @param negativeCallback: Callback function on Negative button click
	 * @param positiveCallback: Callback function on Positive button click
	 */
	this.openDisclaimer = function(headerText, negativeButton, positiveButton, negativeCallback, positiveCallback, timeoutTime) {
		ngDialog.close();
		
		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}
		if(!self.isPopupDisplayed) {
			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.openConfirm({
					template : 'app/framework/components/popup/disclaimerPopup.html',
					data : {
						headerText : headerText,
						positiveButton : positiveButton,
						negativeButton : negativeButton
					},
					className : 'ngdialog-theme-default'
				}).then(function(value) {
					self.isPopupDisplayed = false;
					if (positiveCallback)
						positiveCallback();
				}, function(reason) {
					self.isPopupDisplayed = false;					
				});
		
				setPopup("100%", "100%");
			}, timeoutTime);			
		}
	};
	
	/**
	 * Function to open normal popup
	 * @param message: 		Content text for popup
	 * @param buttonText: 	Button text
	 * @param callBack: 	Callback function on click of button
	 */
	this.openPopup = function(message, buttonText, width, callBack, timeoutTime) {
		ngDialog.close();
		
		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}
		
		if(!self.isPopupDisplayed) {
			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.openConfirm({
					template : 'app/framework/components/popup/normalPopup.html',
					data : {
						message : message,
						buttonText : buttonText,
						callBack : callBack
					},
					className : 'ngdialog-theme-default'
				}).then(function(value) {
					self.isPopupDisplayed = false;
					if (callBack)
						callBack();
				});
		
				setPopup(width);
			}, timeoutTime);
		}
	};

	/**
	 * Function to open normal popup
	 * @param message: 		Content text for popup
	 * @param buttonText: 	Button text
	 * @param callBack: 	Callback function on click of button
	 */
	this.appExchangePopup = function(data, buttonText, width, callBack, timeoutTime) {
		ngDialog.close();

		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}

		if(!self.isPopupDisplayed) {
			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.openConfirm({
					template : 'app/framework/components/popup/abbExchangePopup.html',
					data : {
						appCard : data,
						buttonText : buttonText,
						callBack : callBack
					},
					className : 'ngdialog-theme-default',
					controller: ['$scope', function($scope) {
                        $scope.moreActive =false;
                        $scope.moreBtn = function(){
                             $scope.moreActive =true;
                        };

                        $scope.openApp = function(nameOfPackage) {
                            $scope.confirm();
                            window.plugins.launcher.launch({packageName: nameOfPackage}, $scope.successCallBack, $scope.errorCallBack);
                        };

                        $scope.successCallBack = function() {

                            console.log("App opened successfully!!");
                        };

                        $scope.errorCallBack = function() {
                            console.log("App Failed to opened!!");
                         };
                    }]
				}).then(function(value) {
					self.isPopupDisplayed = false;
					if (callBack)
						callBack();
				});

				setPopup(width);
			}, timeoutTime);
		}
	};

	this.brandSelectionPopup = function(data, callBack, width,addButton,cancelButton,timeoutTime) {
		ngDialog.close();

		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}

		if(!self.isPopupDisplayed) {
			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.openConfirm({
					template : 'app/framework/components/popup/brandSelectionPopup.html',
					data : {
						Brands : data,
												addButton : addButton,
						cancelButton : cancelButton
						 
					},
					className : 'ngdialog-theme-default',
					controller: ['$scope', function($scope) {
                     

                     console.log($scope.brandName);

                    }]
				}).then(function(value) {
					console.log(value);
					self.isPopupDisplayed = false;
					if (callBack)
						callBack(value);
				});

				setPopup(width);
			}, timeoutTime);
		}
	};
	/**
	 * Function to display popup with the url sent as parameter
	 * @param $scope: 		Pass the scope of the from where you want to access the variables into the popup
	 * @param url: 			templte url to be displayed in popup window
	 * @param width: 		Pass the width of the popup here in percentage
	 * @param data: 		Data to be used to be displayed in the custom popover screen
	 */
	this.openPopupWithTemplateUrl = function($scope, url, width, data, timeoutTime) {
		ngDialog.close();
		
		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}
		
//		if(!self.isPopupDisplayed) {
//			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.open({
					template : url,
					data : data,
					scope: $scope,
					className : 'ngdialog-theme-default'
				});
		
				setPopup(width);
			}, timeoutTime);
//		}
	};

	/**
	 * Function to position the popover on the screen
	 * @param referenceElement: 	html element over which popover has to be displayed
	 * @param width: 				templte url to be displayed in popup window
	 * @param direction: 			This parameter has not been used yet. But it can be used the direction of the popup with respect to the ref element
	 */
	var setPopOver = function(referenceElement, width, direction) {
		var loaded = $interval(function() {

			var inspectElement = document.getElementsByClassName('ngdialog-content');

			if (loaded.$$state.value !== 'canceled' && inspectElement.length > 0) {
				$interval.cancel(loaded);

				inspectElement[0].style.display = 'block';

				if (width)
					inspectElement[0].style.width = width;

				var rect = referenceElement.getBoundingClientRect();

				var referenceElementWidth = referenceElement.offsetWidth,
				    referenceElementHeight = referenceElement.offsetHeight,
				    referenceElementX = rect.left,
				    referenceElementY = rect.top;

				var y = referenceElementY + referenceElementHeight,
				    x = '' + ($window.innerWidth - rect.right) + 'px';

				y = '' + y + 'px';

				inspectElement[0].parentElement.style.paddingTop = y;
				inspectElement[0].style.marginRight = x;

			}
		}, 200);
	};
	/**
	 * Function to display popover with reference to passed element
	 * @param $scope: 				Pass the scope of the from where you want to access the variables into the popup
	 * @param url: 					templte url to be displayed in popup window
	 * @param width: 				Pass the width of the popup here in percentage
	 * @param referenceElement: 	html element over which popover has to be displayed
	 * @param direction: 			This parameter has not been used yet. But it can be used the direction of the popup with respect to the ref element
	 * @param data: 				Data to be used to be displayed in the custom popover screen
	 */
	this.openPopupOver = function($scope, url, width, referenceElement, direction, data, timeoutTime) {
		ngDialog.close();
		
		if(timeoutTime == undefined) {
			timeoutTime = 0;
		}		
		
//		if(!self.isPopupDisplayed) {
//			self.isPopupDisplayed = true;
			$timeout(function() {
				self.removePopupElement();
				ngDialog.open({
					template : url,
					data : data,
					scope: $scope,
					className : 'ngdialog-theme-default'
				});
		
				setPopOver(referenceElement, width, direction, data);
			}, timeoutTime);
//		}
	};

	/**
	 * Function to close the popup window
	 */
	this.closePopup = function() {
		ngDialog.close();		
//		var popupElements = document.getElementsByClassName('ngdialog');
//		if(popupElements.length > 0) {
//			angular.forEach(popupElements, function(value, index) {
//				value.remove();
//			});        			
//		}
		self.isPopupDisplayed = false;
	};
	
	this.removePopupElement = function() {
		var popupElements = document.getElementsByClassName('ngdialog');
		for (var i = 0; i < popupElements.length; i++) {
			popupElements[i].parentNode.removeChild(popupElements[i]);
		} 			
	};
}]); 