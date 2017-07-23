var envLock;

if(process.env['NODE_ENV'] !== 'test') {
  // Produce the object Auth0 provides (included from index.html)
  envLock = Auth0Lock
} else {
  // In test, we mock the Auth0 api
  envLock = function() {
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

export default {
  Lock: envLock
}
