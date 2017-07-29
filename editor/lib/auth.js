import config from './config'

const AUTH0_CLIENT_ID    = 'hgqnKQas6FWes8vnrpM6ig4Y5e4PzGJU'
const AUTH0_DOMAIN       = 'paperize.auth0.com'

const lock = new config.Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN)

lock.promptForLogin = () => {
  lock.show()
}

export default lock
