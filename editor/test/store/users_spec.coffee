import store from "../../lib/store"

describe "User management", ->
  context "becoming a new user", ->
    it "creates a new database keyed to the id token"
      # store.dispatch("become")

  context "becoming an existing user", ->

  # it "closes and opens a database when a user logs in", ->
  #   sandbox.stub(p, 'openDatabase')
  #   sandbox.stub(p, 'closeDatabase')
  #   store.dispatch("become", userFixture)
  #   expect(p.openDatabase).to.be.called
  #   expect(p.closeDatabase).to.be.called
  #
  # it "closes the database when a user logs out", ->
  #   sandbox.stub
  #   sandbox.stub(p, 'closeDatabase')
  #   store.dispatch("logout", userFixture)
  #   expect(p.closeDatabase).to.be.called
