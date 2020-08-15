describe.only "Data Manager", ->
  it "Appear at the root"
  it "Says no database is selected"
  it "Says no user is logged in"

  context "Selecting local persistence", ->
    it "creates a database in localStore/IndexedDB"
    it "does not require a login"

  context "Selecting remote persistence", ->
    it "shows Google as an option"
    it "requires a Google login"
    it "creates a database file in Google Drive"
    it "creates a local cache"

  context "With existing local persistence", ->
    it "routes to the game manager"
    it "shows no one logged in"

  context "With existing remote persistence", ->
    it "loads local cache, then remote"
