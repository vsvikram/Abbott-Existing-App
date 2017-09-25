abbottApp.service('menuStatus', function() {
	var self = this;
	this.menuStatus = false;
	this.getMenuStatus=function(){
		return self.menuStatus;
	};
	
	this.setMenuStatus=function(status){
		self.menuStatus=status;
	};
});