commander.factory('activityLogger', function() {
  return new function() {
    var self = this;
    var executionSuccess = null;
    var log = [];
    
    this.saveLog = function(success, msg){
      if (success){
        executionSuccess = true;
      }
      else {
        executionSuccess = false;
      }
      log.unshift({message:msg, status: executionSuccess});
    }
    
    this.getLog = function(msg){ return log; }

    this.status = function(){ return executionSuccess; }

    this.clear = function(){
      log = [];
      executionSuccess = null;
    }
  }
})