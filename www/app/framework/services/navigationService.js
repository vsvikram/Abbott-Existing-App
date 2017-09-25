/**
 * navigationService
 */
abbottApp.service('navigationService', ['$rootScope', 'popupService', '$window', '$state','$location','abbottConfigService', '$timeout',

    function navigationService($rootScope, popupService, $window, $state,$location, abbottConfigService, $timeout) {
        var self = this;
        var isBackPressed = true;
        
        this.registry = {
        	history:[]
        };

    
        this.navigate = function(url, paramsObj, clearHistory){
        	if(clearHistory) {
        		$state.go(url, paramsObj, {location:"replace"});
        	} else {
        		$state.go(url, paramsObj);
        	}
        	self.isBackPressed = false;
            this.registry.history.push(url);
        };     
  
        this.onBackKeyDown = function() {
        	self.isBackPressed = true;
        	if(($rootScope.disablingEdit==true || $rootScope.activitySaved==true) 
        			&& this.registry.history[this.registry.history.length-1]=='dcrCreate'){
        		this.registry.history=[];
        		$location.replace();
        		this.navigate('dcrCalendar');
        	}
        	else if( $location.path()=='/dcrCalendar'){
        		this.registry.history=[];
        		$location.replace();
        		this.navigate('home');
        	} 
        	else if( $location.path()=='/dcrActivitySelection' || $location.path()=='/Expense'){
        		this.registry.history=[];
        		$location.replace();
        		this.navigate('dcrCalendar');
        	}
           	else if( $location.path()=='/dcrCreateActivity'){               
                $rootScope.$emit('goToDCRList');
            }
            else if( $location.path()=='/dcrList'){
                $rootScope.$emit('clearActivityValues');
            }
        	else if( $location.path()=='/helpdeskCreate'){
        		this.registry.history=[];
        		$location.replace();
        		this.navigate('home');
        	}
        	else{
        		$window.history.back();
        		this.registry.history.pop();
        	}
        };
        
        this.isBackOperation = function() {
        	return self.isBackPressed;
        };

        this.canGoBack = function() {
            return $state.current.name != "home";
        };
        
        //Set the isBackPressed manually for skipping double back navigation
        this.simulateBackOperation = function() {
            self.isBackPressed  = true;
        };

        this.backFunc = function() {       	
        	$timeout(function() {
        		var transperantConfig = abbottConfigService.getTransparency(),
        			popupElements = document.getElementsByClassName('ngdialog');
	            if (self.canGoBack()) {     
	        		transperantConfig.display = false;
	        		abbottConfigService.setTransparency(transperantConfig);	            	
	                self.onBackKeyDown();
	                popupService.closePopup();	        		
	        		if(popupElements.length > 0) {
	        			angular.forEach(popupElements, function(value, index) {
	        				value.remove();
	        			});        			
	        		}	                
	            }
	            else {
	            	if(popupElements.length == 0) {
		            	var locale = abbottConfigService.getLocale();
						popupService.openConfirm(locale.ExitApplication, locale.ExitApplicationConfirmation, locale.No, locale.Yes, '35%', function(){
		
						}, function(){
							//localStorage.removeItem("isLoggedIn");
							navigator.app.exitApp();
						});		            		
	            	}                 
	            }        		
        	}, 500);
        };
    }
]);
