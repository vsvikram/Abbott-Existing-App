(function(){
  function keyMessageModel(utils, entityModel){
    var KeyMessageModel = function(){
      KeyMessageModel.super.constructor.apply(this, arguments);
    };

    KeyMessageModel = utils.extend(KeyMessageModel, entityModel);
    KeyMessageModel.description = 'Key Message';
    KeyMessageModel.tableSpec = {
      sfdc: 'Key_Messages__c',
      local: 'Key_Messages__c'
    };

    KeyMessageModel.fieldsSpec = [
      {sfdc: 'Id', indexWithType: 'string'},
      {sfdc: 'Key_Message__c'},
      {sfdc: 'Divisionwise_Brand__c'}
    ];

    KeyMessageModel.mapModel();
    return KeyMessageModel;
  }

  abbottApp.factory('keyMessageModel', [
    'utils',
    'entityModel',
    keyMessageModel
  ]);
})();