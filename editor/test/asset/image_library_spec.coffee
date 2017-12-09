{ FileList, File, FileReader } = require('file-api')
import store from '../../lib/store'
import persistence from '../../lib/store/pouch_persistence'
persistence.openDatabase('test-database')

describe 'Image library', ->
  context 'handles file uploads', ->
    it "takes a FileList, reads files, inserts into pouch", ->
      # Grab an actual file from the filesystem
      files = new FileList([
        new File('static/images/blank-avatar.png')
      ])

      # Dispatch the action
      store.dispatch('importImageFiles', files).then (result) ->
        # Result is an array of imported image assets
        expect(result[0].name).to.eql('blank-avatar.png')
        expect(result[0]._id).to.eql("1066a9e770ca87297cad655869ee6cff")

        # The store has had its asset index updated with the new image
        expect(store.state.assets.images[0]).to.eql({
          id: "1066a9e770ca87297cad655869ee6cff"
          name: 'blank-avatar.png'
        })

        # The database has had the data inserted to its own record ID'd to the _id
        persistence.db.get(result[0]._id).then (asset) ->
          expect(asset.name).to.equal 'blank-avatar.png'
