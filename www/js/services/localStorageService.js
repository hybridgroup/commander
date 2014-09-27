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
      localStorage.commander = JSON.stringify(data)
      $rootScope.$broadcast(self.Event.updated, fetchData())
    }

    var init = function(){
      localStorage.commander = JSON.stringify({
        api: "",
        command_sets: [],
        current_command_set: null
      })
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

    this.clear = function() {
      init();
    }

    this.api = function() { return fetchData()['api'] }
    this.commandSets = function() {
      var sets = fetchData()['command_sets']
      if (!sets) {
        this.set('command_sets', []);
      }
      return fetchData()['command_sets']
    }
    this.log = function() { return fetchData()['log'] }

    // Events
    this.Event = {'updated': 'LocalStorageService.updated'};
  }
}]);
