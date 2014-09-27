commander.factory('LocalStorageService', ['$rootScope', function($rootScope){
  return new function() {
    var self = this;
    var data = null;

    var fetchData = function(){
      if (!localStorage.commander)
        init()

      return JSON.parse(localStorage.commander);
    }

    var save = function() {
      console.log(data)
      localStorage.commander = JSON.stringify(data)
      $rootScope.$broadcast(self.Event.updated, fetchData())
    }

    var init = function(){
      localStorage.commander = JSON.stringify({})
    }

    this.get = function(key) {
      var data = fetchData()
      if (key) {
        return data[key];
      } else {
        return data
      }
    }

    this.set = function(key, value) {
      data = fetchData();
      data[key] = value;
      save()
    }

    this.appendCommandSets = function(commandSets) {
      data = fetchData()
      for (i = 0; i < commandSets.length; i++) {
        data.command_sets.push(commandSets[i])
      }
      save()
    }

    this.api = function() { return fetchData()['api'] }
    this.commandSets = function() { return fetchData()['command_sets'] }
    this.log = function() { return fetchData()['log'] }

    // Events
    this.Event = {'updated': 'LocalStorageService.updated'};
  }
}]);
