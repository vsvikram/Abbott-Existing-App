(function() {
  'use strict';

  var selector = '.highlight-element',
      highlightClass = 'pseudo-active';

  angular
  .module('media')
  .directive('trackHighlightOnClick', function(){
    return link;
  });

  function link(scope, element, attrs){
    var $element = $(element),
        $document = $(document);

    $element.on('touchstart', selector, addClass);
    $element.on('touchend', selector, removeClass);
    $document.on('resume', removeClassForAllElements);

    scope.$on('$destroy', function(){
      $element.off('touchstart', selector, addClass);
      $element.off('touchend', selector, removeClass);
      $document.off('resume', removeClassForAllElements);
    });

    function removeClassForAllElements(){
      $element.find(selector).removeClass(highlightClass);
    }
  }

  function addClass(event){
    this.classList.add(highlightClass);
  }

  function removeClass(){
    this.classList.remove(highlightClass);
  }

})();