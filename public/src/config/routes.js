import auth from '../utils/auth.js'
import App from '../components/App'
import Login  from '../components/Login'
import { connect } from 'react-redux'

function loggedIn() {
    return !!localStorage.token
}

function redirectToLogin(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (loggedIn()) {
      replace('/')
  }
}

const Routes = {
  component: App,
  childRoutes: [
    { path: '/logout',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
            const Logout = require('../components/Logout')
            cb(null, Logout)
        })
      }
    },

    { onEnter: redirectToLogin,
      childRoutes: [
        { path: '/barang',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../components/Barang'))
            })
          }
        }
        // ...
      ]
    },


    { onEnter: redirectToDashboard,
      childRoutes: [
        // Unauthenticated routes
        // Redirect to dashboard if user is already logged in
        { path: '/login',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, Login)
            })
          }
        }
        // ...
      ]
    },

    { onEnter: redirectToLogin,
      childRoutes: [
        // Protected routes that don't share the dashboard UI
        { path: '/user',
          getComponent: (location, cb) => {
            require.ensure([], (require) => {
                const User = require('../components/User')
                cb(null, User)
            })
          }
        }
        // ...
      ]
    },

    { path: '/',
      getComponent: (location, cb) => {
        if (loggedIn()) {
            return require.ensure([], (require) => {
                cb(null, require('../components/Dashboard'))
            })
        }
        return require.ensure([], (require) => {
          cb(null, Login)
        })
      },
      indexRoute: {
        getComponent: (location, cb) => {
          // Only load if we're logged in
          if (loggedIn()) {
            return require.ensure([], (require) => {
                const PageOne = require('../components/PageOne')
              cb(null, PageOne)
            })
          }
          return cb()
        }
      },
      childRoutes: [
        { onEnter: redirectToLogin,
          childRoutes: [
            // Protected nested routes for the dashboard
            { path: '/page2',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    const PageTwo = require('../components/PageTwo')
                    cb(null, PageTwo)
                })
              }
            }
            // ...
          ]
        }
      ]
    }

  ]
}

export default Routes
