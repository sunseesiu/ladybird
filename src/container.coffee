
class Container

  params: {}

  components: {}

  instances: {}

  currents: {}

  constructor: (params = {}) ->
    @params = params

  bind: (name, properties) ->
    @components[name] = properties

  load: require

  has: (name) -> @components[name]

  clone: (obj) ->
    return obj if obj == null or typeof obj != 'object'
    clone = {}
    for i of obj
      clone[i] = if typeof obj[i] == "object" then @clone(obj[i]) else obj[i]
    return clone

  get: (name) ->
    # Return special instances
    return @instances[name] if @instances[name]
    return @ if name is "this-container"
    return @clone(@) if name is "clone-container"

    # Component not found
    throw new Error("Component '"+name+"' does not exist in container.") if not @components[name]
    throw new Error("Get component failed, recursive call: " + name) if @currents[name]

    @currents[name] = true
    properties = if @components[name] then @components[name] else {}
    obj = @load(name)

    # Inject properties
    for k,v of properties
      throw new Error("Undefined property: #{name}.#{k}") if typeof obj.prototype[k] == "undefined"
      obj.prototype[k] = @inject(v, name)

    @currents[name] = false

    return new obj()

  inject: (propertyValue, component) ->
    if typeof propertyValue == 'object'
      value = {}
      for k, v in propertyValue
        value[k] = @inject(v, component)
    else if propertyValue.slice(0, 1) == "%" and propertyValue.slice(-1) == "%"
      value = @getParam(propertyValue)
    else
      value = @get(propertyValue)

    return value

  setParam: (k, v) ->
    @params[k] = v

  # Given an accessor specification %param.foo.bar% traverse the param and return value.
  getParam: (accessor) ->
    key = accessor.slice(1, accessor.length - 1)
    parts = key.split(".")
    current = @params
    for i in [0...parts.length]
      k = parts[i]
      current = current[k]
    return current

module.exports = Container
