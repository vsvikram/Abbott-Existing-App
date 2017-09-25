abbottApp.service('roundProgService', [function() {

	this.generateCirlceProg = function(customConfig){
		var defaultConfig = {
				max : 100,
				bgcolor: '#f4f4f4',
				radius: "35",
				stroke: 3, 
				semi: false, 
				rounded: true, 
				clockwise: true ,
				responsive: true,  
				duration: 800,
				animation:"easeInOutQuart",
				animationDelay:"100"
			}		
		return this.mergeObject(defaultConfig, customConfig)	
	}

	this.mergeObject = function(defaultObj, updatedObj) {
        if (updatedObj) {
            for (var key in updatedObj) {
                if (key in defaultObj) {
                    defaultObj[key] = updatedObj[key]
                }
            }
        }
        return defaultObj;
    }
     

}]);