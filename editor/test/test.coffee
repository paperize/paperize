require "./store/games_spec.coffee"

chai = require("chai")
global.expect = chai.expect
sinon = require("sinon")
global.sandbox = sinon.createSandbox()
global.spy = sandbox.spy
global.stub = sandbox.stub
global.fake = sandbox.fake
global.mock = sandbox.mock

sinonChai = require("sinon-chai")
chai.use(sinonChai)

afterEach ->
  sandbox.restore()
