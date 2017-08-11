const AUTH0_CLIENT_ID    = 'hgqnKQas6FWes8vnrpM6ig4Y5e4PzGJU'
const AUTH0_DOMAIN       = 'paperize.auth0.com'

// Lock
if(process.env['NODE_ENV'] === 'test') {
  Auth0Lock = function() {
    // short circuit getProfile in test
    return {
      getProfile(idToken, callback) {
        console.log("Profile requested for token:", idToken)
        callback(null, {
          nickname: 'Test User',
          picture: 'http://placehold.it/40/40'
        })
      },

      show () { },
      on () { }
    }
  }
}

let options = {
  auth: {
    params: {
      access_type: "offline" // Causes Google to provide a refresh token
    }
  }
}

const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, options)

lock.promptForLogin = () => {
  lock.show()
}

if(process.env['NODE_ENV'] === 'test') {
  window.lock = lock
}


export default lock
