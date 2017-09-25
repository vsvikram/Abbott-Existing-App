abbottApp.service('dcrHelperService',
function() {                                  
	var self = this;
	var customerDetails = [];
	var dcrBrandActivity = [];
	var currentCustomerIndex = 0;
	var currentActivityIndex = 0;
	var brandsList = [];
	var materialList = [];	
	var activityBrands = [];
	var customers = [];
	var paginationDetails = [];
	var activityDetails = [];
	
	this.getCustomerDetails=function(){
		return customerDetails;
	};
	
	this.setCustomerDetails=function(details){
		customerDetails=details;
	};
	
	this.getCurrentCustomerIndex=function(){
		return currentCustomerIndex;
	};
	
	this.setCurrentCustomerIndex=function(index){
		currentCustomerIndex=index;
	};
	
	this.getDCRBrandActivity=function(){
		return dcrBrandActivity;
	};
	
	this.setDCRBrandActivity=function(brandActivity){
		dcrBrandActivity=brandActivity;
	};
	
	this.getBrandsList=function(){
		return brandsList;
	};
	
	this.setBrandsList=function(list){
		brandsList=list;
	};
	
	this.getMaterialList=function(){
		return materialList;
	};
	
	this.setMaterialList=function(list){
		materialList=list;
	};	
	
	this.getActivityDetailsData=function(){
		return activityDetails;
	};
	
	this.setActivityDetailsData=function(brandData){
		activityDetails=brandData;
	};
	
	this.getActivityBrandsData=function(){
		return activityBrands;
	};
	
	this.setActivityBrandsData=function(brands){
		activityBrands=brands;
	};
	
	this.getAddCustomersData=function(){
		return customers;
	};
	
	this.setAddCustomersData=function(customerData){
		customers=customerData;
	};
	
	this.getPaginationData=function(){
		return paginationDetails;
	};
	
	this.setPaginationData=function(paginationData){
		paginationDetails=paginationData;
	};
	
	this.getCurrentActivityIndex=function(){
		return currentActivityIndex;
	};
	
	this.setCurrentActivityIndex=function(activityIndex){
		currentActivityIndex=activityIndex;
	};
});