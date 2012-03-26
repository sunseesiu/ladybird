(function() {
  var Application, Container, Router;

  Container = require("./container");

  Router = require("./router");

  Application = (function() {

    function Application() {}

    Application.prototype.router = null;

    Application.prototype.container = null;

    Application.prototype.event = null;

    Application.prototype.contructor = function() {
      this.container = new Container;
      return this.router = new Router;
    };

    Application.prototype.set = function(name, value) {
      return this.container.setParam(name, value);
    };

    Application.prototype.get = function(path, controller) {
      return this.router.get(path).to(controller);
    };

    Application.prototype.post = function(path, controller) {
      return this.router.post(path).to(controller);
    };

    Application.prototype.put = function(path, controller) {
      return this.router.put(path).to(controller);
    };

    Application.prototype.del = function(path, controller) {
      return this.router.del(path).to(controller);
    };

    Application.prototype.bind = function(name, propertes) {
      return this.container.bind(name, properties);
    };

    Application.prototype.on = function(name, value) {
      return this.event.on(name, value);
    };

    Application.prototype.run = function(req, res) {
      var code, content, controller, p;
      try {
        req.params = this.router.first(require('url').parse(req.url).pathname);
        p = req.params;
        if (p.controller && p.action) {
          code = 200;
          controller = this.container.get(p.controller);
          content = controller[p.action](req, res);
        } else {
          code = 404;
          content = this.controller.get("controller/notfound").execute();
        }
      } catch (error) {
        code = 500;
        controller = this.container.get("controller/error");
        content = controller.execute(error);
      }
      res.writeHead(code, {
        'Content-Type': 'text/plain'
      });
      return res.end(content);
    };

    Application.prototype.start = function() {
      var http;
      http = require('http');
      http.createServer(this.run).listen(2012);
      return console.log('Server running at http://localhost:2012/');
    };

    return Application;

  })();

  module.exports = Application;

}).call(this);
