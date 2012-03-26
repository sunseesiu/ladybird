Ladybird
========

When Dependency Injection meets CoffeeScript

Container
---------

``` coffeescript
    # Example Bar class
    class Bar
      output: (user) ->
        console.log("hello " + user)

    # Example Foo class
    class Foo
      barObj: null
      user: null
      send: ->
        @barObj.output(@user)

    # New container instance
    c = new Container {"user": {"name": "sun"}}

    # Register a loader function, default use nodejs require method
    c.load = (name) ->
      return Foo if name == "foo"
      return Bar if name == "bar"

    # Bind class with properties
    c.bind "foo", {"barObj": "bar", "user":"%user.name%"}
    c.bind "bar", {}

    # Get foo component and call send method
    c.get("foo").send()
```

Application
-----------

``` coffeescript
    Ladybird = require "ladybird"
    app = new Ladybird

    # Options
    app.set "env", "dev"
    app.set "appdir", "./app"
    app.set "port", 2012

    # Routers
    app.get "/:beverage/near/:location(.:format)", "controllers/beverage.byLocation"

    # Containers
    app.bind "controllers/beverage", {}
    app.bind "controllers/user", {"userModel": "models/user"}

    # Events
    app.on "user.beforeLogin", "models/session.onBeforeLogin"

    # Start
    app.start()
```
