commander.factory('myHttpInterceptor', function($q) {
  return {
    // optional method
    request: function(config) {
      // do something on success
      config.timeout = 3000;
      return config;
    }
  };
});
commander.config(['$httpProvider', function($httpProvider) {  
  $httpProvider.interceptors.push('myHttpInterceptor');
}]);
