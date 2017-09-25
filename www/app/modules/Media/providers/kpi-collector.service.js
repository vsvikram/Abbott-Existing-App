(function () {
  'use strict';

  function kpiCollectorService(utils, dcrKpiDataCollection) {
    var KpiCollectorService = function () {
      this.SLIDES_KEY = 'slides';
      this.clearKPIs = utils.bind(this.clearKPIs, this);
      this.addKPI = utils.bind(this.addKPI, this);
      this.mergeKPI = utils.bind(this.mergeKPI, this);
      this.getPresentationTime = utils.bind(this.getPresentationTime, this);
      this.saveKPIs = utils.bind(this.saveKPIs, this);
      this.prepareEntitiesForSave = utils.bind(this.prepareEntitiesForSave, this);
      this.mergeExistKPIFromDB = utils.bind(this.mergeExistKPIFromDB, this);
      this.dcrKpiDataCollection = new dcrKpiDataCollection;
    };

    KpiCollectorService.prototype.clearKPIs = function () {
      this.KPIs = {};
    };

    KpiCollectorService.prototype.addKPI = function (brandId, divisionwiseBrandPresentationId, jsonKPI) {
      var currentKPIObject = {
        brandId: brandId,
        divisionwiseBrandPresentationId: divisionwiseBrandPresentationId,
        jsonKPI: jsonKPI ? JSON.parse(jsonKPI) : {slides: []}
      };

      if (this.KPIs[divisionwiseBrandPresentationId]) {
        this.KPIs[divisionwiseBrandPresentationId] = this.mergeKPI(currentKPIObject, this.KPIs[currentKPIObject.divisionwiseBrandPresentationId]);
      } else {
        this.KPIs[divisionwiseBrandPresentationId] = JSON.parse(JSON.stringify(currentKPIObject));
      }
    };

    KpiCollectorService.prototype.mergeKPI = function (currentKPIObject, baseKPIObject) {
      var that = this,
        resultJson = {
          brandId: baseKPIObject.brandId,
          divisionwiseBrandPresentationId: baseKPIObject.divisionwiseBrandPresentationId,
          jsonKPI: {slides: []}
        };

      [baseKPIObject, currentKPIObject].forEach(function (KPIObject) {
        var key;
        // Clone custom fields
        for (key in KPIObject.jsonKPI) {
          if (KPIObject.jsonKPI.hasOwnProperty(key)) {
            if (key != that.SLIDES_KEY) {
              resultJson.jsonKPI[key] = KPIObject.jsonKPI[key];
            }
          }
        }
      });

      baseKPIObject.jsonKPI[that.SLIDES_KEY].forEach(function (slideObject) {
        // Update old kpi slides time
        var filteredSlide = currentKPIObject.jsonKPI[that.SLIDES_KEY].filter(function (slide) {
          return slide.id == slideObject.id;
        });
        if (filteredSlide.length) {
          slideObject.time = +slideObject.time + +filteredSlide[0].time
        }
        resultJson.jsonKPI[that.SLIDES_KEY].push(slideObject);
      });

      currentKPIObject.jsonKPI[that.SLIDES_KEY].forEach(function (slideObject) {
        // Add new kpi slides
        var filteredSlide = baseKPIObject.jsonKPI[that.SLIDES_KEY].filter(function (slide) {
          return slide.id == slideObject.id;
        });
        if (!filteredSlide.length) {
          resultJson.jsonKPI[that.SLIDES_KEY].push(slideObject);
        }
      });

      return JSON.parse(JSON.stringify(resultJson));
    };

    KpiCollectorService.prototype.getPresentationTime = function (divisionwiseBrandPresentationId) {
      var totalTime = 0;
      this.KPIs[divisionwiseBrandPresentationId].jsonKPI[this.SLIDES_KEY].forEach(function (slide) {
        totalTime += +slide.time;
      });
      return totalTime;
    };

    KpiCollectorService.prototype.prepareEntitiesForSave = function(dcrId, dcrJunctionId){
      var that = this;
        return Object.keys(that.KPIs).map(function (key) {
          var timeOnPresentation = that.getPresentationTime(that.KPIs[key].divisionwiseBrandPresentationId) || 0,
            timeOnSlides = timeOnPresentation / that.KPIs[key].jsonKPI[that.SLIDES_KEY].length || 0;
          return {
            "DCR__c": dcrId,
            "DCR_Junction__c": dcrJunctionId,
            "Divisionwise_Brand__c": that.KPIs[key].brandId,
            "ED_Divisionwise_Brand_Presentation__c": that.KPIs[key].divisionwiseBrandPresentationId,
            "KpiSrcJson__c": JSON.stringify(that.KPIs[key].jsonKPI),
            "TimeOnPresentation__c": timeOnPresentation,
            "TimeOnSlides__c": timeOnSlides
          }
        });
    };

    KpiCollectorService.prototype.mergeExistKPIFromDB = function(entities){
      var that = this;
      return entities.map(function(entity){
        var baseKPIObject = {
            brandId: entity.Divisionwise_Brand__c,
            divisionwiseBrandPresentationId: entity.ED_Divisionwise_Brand_Presentation__c,
            jsonKPI: JSON.parse(entity.KpiSrcJson__c)
          };
        if(that.KPIs[entity.ED_Divisionwise_Brand_Presentation__c]){
          that.KPIs[entity.ED_Divisionwise_Brand_Presentation__c] = that.mergeKPI(that.KPIs[entity.ED_Divisionwise_Brand_Presentation__c], baseKPIObject);
        }else{
          that.KPIs[entity.ED_Divisionwise_Brand_Presentation__c] = JSON.parse(JSON.stringify(baseKPIObject));
        }
      });
    };

    KpiCollectorService.prototype.prepareEntitiesForUpdate = function(entities, dcrId, dcrJunctionId){
      var that = this, entitiesForSave;
      that.mergeExistKPIFromDB(entities);
      entitiesForSave = that.prepareEntitiesForSave(dcrId, dcrJunctionId);
      return entitiesForSave.map(function(entityForSave){
        var filteredEntities = entities.filter(function(entity){
          return (entityForSave.DCR__c == entity.DCR__c) && (entityForSave.ED_Divisionwise_Brand_Presentation__c == entity.ED_Divisionwise_Brand_Presentation__c);
        });
        if(filteredEntities.length){
          ["KpiSrcJson__c", "TimeOnPresentation__c", "TimeOnSlides__c"].forEach(function(keyFields){
            filteredEntities[0][keyFields] = entityForSave[keyFields];
          });
          return filteredEntities[0];
        }else{
          return entityForSave;
        }
      });
    };

    KpiCollectorService.prototype.removeKPIs = function(dcrJunctionIds){
      var that = this;
      if(dcrJunctionIds.length){
        that.dcrKpiDataCollection.fetchAllWhereIn("DCR_Junction__c", dcrJunctionIds)
        .then(that.dcrKpiDataCollection.fetchRecursiveFromCursor)
        .then(function(entities){
          console.log(entities);
          return entities;
        })
        .then(that.dcrKpiDataCollection.removeEntities);
      }
    };

    KpiCollectorService.prototype.saveKPIs = function (dcrId, dcrJunctionId) {
      var that = this;
      that.dcrKpiDataCollection.fetchAllWhere({"DCR__c": dcrId, "DCR_Junction__c": dcrJunctionId})
      .then(that.dcrKpiDataCollection.fetchRecursiveFromCursor)
      .then(function(entities){
        if(entities.length){
          return that.dcrKpiDataCollection.upsertEntities(that.prepareEntitiesForUpdate(entities, dcrId, dcrJunctionId));
        }else{
          return that.dcrKpiDataCollection.upsertEntities(that.prepareEntitiesForSave(dcrId, dcrJunctionId));
        }
      })
      .then(that.clearKPIs, that.clearKPIs);
    };
    return new KpiCollectorService;
  }

  abbottApp.service('kpiCollectorService', [
    'utils',
    'dcrKpiDataCollection',
    kpiCollectorService
  ]);

})();