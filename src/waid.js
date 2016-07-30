function config() {
  this.config = {};
  this.setConfig = function(key, config) {
    this[key] = config;
  }
  this.getConfig = function(key) {
    parts = key.split('.')
    if (parts.length > 0) {
      var config = this;
      for (var i=0; i < parts.length; i++) {
        if (typeof config[parts[i]] !== 'undefined') {
      	  if (typeof config[parts[i]] == 'object') {
      	  	// set new config
      	  	config = config[parts[i]];
      	  	continue;
      	  } else {
      	  	return config[parts[i]]
      	  }
        } else {
          return false;
        }
      }
    }
    return this[key];
  }
}

function waid() {
  this.config = new config();
}

var waid = new waid();