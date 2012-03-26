Container = require "./container"
Router = require "./router"

class Application
  router: null
  container: null
  event: null

  contructor: () ->
    @container = new Container
    @router = new Router

  set: (name, value) ->
    @container.setParam(name, value)

  get: (path, controller) ->
    @router.get(path).to(controller)

  post: (path, controller) ->
    @router.post(path).to(controller)

  put: (path, controller) ->
    @router.put(path).to(controller)

  del: (path, controller) ->
    @router.del(path).to(controller)

  bind: (name, propertes) ->
    @container.bind(name, properties)

  on: (name, value) ->
    @event.on(name, value)

  run: (req, res) ->
    try
      req.params = @router.first(require('url').parse(req.url).pathname)
      p = req.params
      if p.controller and p.action
        code = 200
        controller = @container.get(p.controller)
        content = controller[p.action](req, res)
      else
        code = 404
        content = @controller.get("controller/notfound").execute()
    catch error
      code = 500
      controller = @container.get("controller/error")
      content = controller.execute(error)

    res.writeHead(code, {'Content-Type': 'text/plain'})
    res.end(content)

  start: ->
    http = require('http')
    http.createServer(@run).listen(2012)
    console.log('Server running at http://localhost:2012/')

module.exports = Application
