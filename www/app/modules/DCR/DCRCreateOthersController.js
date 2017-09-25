abbottApp.controller('DCRCreateOthersController', [
  '$scope',
  'navigationService',
  'abbottConfigService',
  function($scope, navigationService, abbottConfigService){
    $scope.tabTitle = $scope.$parent.tabTitle;

  }
]);