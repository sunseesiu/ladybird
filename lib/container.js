(function() {
  var Container;

  Container = (function() {

    Container.prototype.params = {};

    Container.prototype.components = {};

    Container.prototype.instances = {};

    Container.prototype.currents = {};

    function Container(params) {
      if (params == null) params = {};
      this.params = params;
    }

    Container.prototype.bind = function(name, properties) {
      return this.components[name] = properties;
    };

    Container.prototype.load = require;

    Container.prototype.has = function(name) {
      return this.components[name];
    };

    Container.prototype.clone = function(obj) {
      var clone, i;
      if (obj === null || typeof obj !== 'object') return obj;
      clone = {};
      for (i in obj) {
        clone[i] = typeof obj[i] === "object" ? this.clone(obj[i]) : obj[i];
      }
      return clone;
    };

    Container.prototype.get = function(name) {
      var k, obj, properties, v;
      if (this.instances[name]) return this.instances[name];
      if (name === "this-container") return this;
      if (name === "clone-container") return this.clone(this);
      if (!this.components[name]) {
        throw new Error("Component '" + name + "' does not exist in container.");
      }
      if (this.currents[name]) {
        throw new Error("Get component failed, recursive call: " + name);
      }
      this.currents[name] = true;
      properties = this.components[name] ? this.components[name] : {};
      obj = this.load(name);
      for (k in properties) {
        v = properties[k];
        if (typeof obj.prototype[k] === "undefined") {
          throw new Error("Undefined property: " + name + "." + k);
        }
        obj.prototype[k] = this.inject(v, name);
      }
      this.currents[name] = false;
      this.instances[name] = new obj();
      return this.instances[name];
    };

    Container.prototype.inject = function(propertyValue, component) {
      var k, v, value, _len;
      if (typeof propertyValue === 'object') {
        value = {};
        for (v = 0, _len = propertyValue.length; v < _len; v++) {
          k = propertyValue[v];
          value[k] = this.inject(v, component);
        }
      } else if (propertyValue.slice(0, 1) === "%" && propertyValue.slice(-1) === "%") {
        value = this.getParam(propertyValue);
      } else {
        value = this.get(propertyValue);
      }
      return value;
    };

    Container.prototype.setParam = function(k, v) {
      return this.params[k] = v;
    };

    Container.prototype.getParam = function(accessor) {
      var current, i, k, key, parts, _ref;
      key = accessor.slice(1, accessor.length - 1);
      parts = key.split(".");
      current = this.params;
      for (i = 0, _ref = parts.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        k = parts[i];
        current = current[k];
      }
      return current;
    };

    return Container;

  })();

  if (typeof module !== "undefined" && module !== null) module.exports = Container;

}).call(this);
