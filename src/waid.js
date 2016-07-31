function config() {
  this.config = {};

  this.mergeRecursive = function(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor==Object ) {
          obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  }

  this.patchConfig = function(key, config) {
    this[key] = this.mergeRecursive(this[key], config)
  }

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