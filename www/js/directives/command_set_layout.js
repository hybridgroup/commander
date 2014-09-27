commander.directive("commandSetLayout", function() {
  var directive = {};
  directive.restrict = "E";
  directive.link = function(scope, element, attrs){
    scope.getContentUrl = function(){
      return "layouts/" + attrs.name + ".html";
    };
  };
  directive.template = '<div ng-include="getContentUrl()"></div>';

  return directive;
});