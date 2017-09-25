abbottApp.service('abbottConfigService', [
  'LANGUAGES','SALESFORCE_QUERIES',
  function dbConfigService(LANGUAGES, SALESFORCE_QUERIES){
    var self = this;
		this.dbConfig = null;
    this.transparentConfig = {
      display: false,
      showBusyIndicator: false,
      showBusyIndicatorText:'',
      showTransparancy: false
    };
    this.dcrDate = null;
		this.sessionToken = {};
    this.locale = null;
		this.platform = "Android";
		this.appQueries = {};
		this.force = {};
		
		this.getForceObject = function(){
			return  self.force;
		};

		this.setForceObject = function(forceObject){
        	self.force = forceObject
        };

		this.getPlatform = function(){
			return self.platform;
		};
		this.setPlatform = function(platform){
			self.platform = platform;
		};			
		this.getLocale = function(){
		  self.locale = self.locale || LANGUAGES.ENGLISH;
		  return self.locale;
		};

		this.setLocale = function(localeObj){
		  self.locale = localeObj;
		};

		this.getDCRDate = function(){
			return self.dcrDate;
		};

		this.setDCRDate = function(date){
			self.dcrDate = date;
		};

		this.getTransparency = function(){
			return self.transparentConfig;
		};
		this.setTransparency = function(config){
			self.transparentConfig = config;
		};
		
		this.getDBConfig = function(){
			return self.dbConfig;
		};
		this.setDBConfig = function(config){
			self.dbConfig = config;
		};		

		this.setSessionToken = function(token){
			self.sessionToken = token;
		};
		this.getSessionToken = function(){
			return self.sessionToken;
		};

}]);