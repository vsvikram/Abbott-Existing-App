(function(){
  function entityModel(){
    var EntityModel = function(properties){
      this.properties = properties;
    };
    
    EntityModel.sfdc = null;
    EntityModel.externalId = 'Id';
    EntityModel.indexSpec = null;
    EntityModel.uploadableFields = null;
    EntityModel.description = 'Entity';
    EntityModel.tableSpec = {};
    EntityModel.fieldsSpec = [];
    EntityModel.localSpec = [
      {
        'path': '__local__',
        'type': 'string'
      },
      {
        'path': '__locally_created__',
        'type': 'string'
      },
      {
        'path': '__locally_updated__',
        'type': 'string'
      },
      {
        'path': '__locally_deleted__',
        'type': 'string'
      }
    ];

    EntityModel.localMappingSpec = [];
    
    
    EntityModel.mapModel = function(){
      this.generateProps();
      this.generateSfdcFields();
      this.generateIndexSpec();
      this.generateUploadFields();
    };

    EntityModel._valueOfField = function(fieldSpec){
      return fieldSpec.sfdc || fieldSpec.local;
    };

    EntityModel.generateProps = function(){

    };

    EntityModel.generateSfdcFields = function(){
      this.sfdc = this.fieldsSpec.filter(function(fieldSpec){
        return !!fieldSpec.sfdc;
      }).map(function(fieldSpec){
        return fieldSpec.sfdc;
      });
      return this.sfdc;
    };

    EntityModel.generateIndexSpec = function(){
      this.indexSpec = this.fieldsSpec.filter(function(fieldSpec){
        return !!fieldSpec.indexWithType;
      }).map(function(fieldSpec){
        return {
          path: this._valueOfField(fieldSpec),
          type: fieldSpec.indexWithType
        };
      }, this).concat(this.localSpec).concat(this.localMappingSpec);
      return this.indexSpec;
    };

    EntityModel.generateUploadFields = function(){
      this.uploadableFields = this.fieldsSpec.filter(function(fieldSpec){
        return !!fieldSpec.upload;
      }).map(function(fieldSpec){
        return this._valueOfField(fieldSpec);
      }, this);
      return this.uploadableFields;
    };

    EntityModel.getAttributes = function(entity){
      var attributes = {};
      this.uploadableFields.forEach(function(attrKey){
        attributes[attrKey] = entity[attrKey];
      });
      return attributes;
    };
    
    EntityModel.mapModel();
    return EntityModel;
  }

  abbottApp.factory('entityModel', [
    entityModel
  ]);
})();