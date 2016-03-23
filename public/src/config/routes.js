import auth from '../utils/auth.js'
import App from '../components/App'
import Login  from '../components/Login'

function redirectToLogin(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (auth.loggedIn()) {
    replace('/')
  }
}

export default {
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

    {
      childRoutes: [
        // Unauthenticated routes
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
        // Share the path
        // Dynamically load the correct component
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
              const Dashboard = require('../components/Dashboard')
              cb(null, Dashboard)
          })
        }
        return require.ensure([], (require) => {
          cb(null, Login)
        })
      },
      indexRoute: {
        getComponent: (location, cb) => {
          // Only load if we're logged in
          if (auth.loggedIn()) {
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
