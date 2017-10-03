require "./store/games_spec.coffee"
require "./store/users_spec.coffee"
require "./store/persistence_spec.coffee"

chai = require("chai")
global.expect = chai.expect
sinon = require("sinon")
global.sandbox = sinon.createSandbox()
sinonChai = require("sinon-chai")
chai.use(sinonChai)

afterEach ->
  sandbox.restore()
