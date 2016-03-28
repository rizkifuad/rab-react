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
      replace('/dashboard')
  }
}

const Routes = {
  childRoutes: [
    { path: '/logout',
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
            const Logout = require('../components/Logout')
            cb(null, Logout)
        })
      }
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


    { path: '/',
      getComponent: (location, cb) => {
        if (loggedIn()) {
            return require.ensure([], (require) => {
                cb(null, require('../components/App'))
            })
        }
        return require.ensure([], (require) => {
          cb(null, Login)
        })
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
        },

        { 
            onEnter: redirectToLogin,
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

        { 
            onEnter: redirectToLogin,
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


      ]
    }

  ]
}

export default Routes
