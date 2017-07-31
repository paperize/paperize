const AUTH0_CLIENT_ID    = 'hgqnKQas6FWes8vnrpM6ig4Y5e4PzGJU'
const AUTH0_DOMAIN       = 'paperize.auth0.com'

let Lock

if(process.env['NODE_ENV'] !== 'test') {
  // Produce the object Auth0 provides (included from index.html)
  Lock = Auth0Lock
} else {
  // In test, we mock the Auth0 api
  Lock = function() {
    return {
      getProfile: function(idToken, callback) {
        console.log("Profile requested for token:", idToken);
        callback(null, {
          nickname: 'Test User',
          picture: 'http://placehold.it/40/40'
        });
      },
      show: function() { console.log('lock.show() called'); },
      on: function() { console.log('lock.on() called'); }
    };
  }
}

const lock = new Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN)

lock.promptForLogin = () => {
  lock.show()
}

export default lock
