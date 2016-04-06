import App from '../components/App'
import Login  from '../components/Login'
import { connect } from 'react-redux'


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



    { 
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
          return require.ensure([], (require) => {
              cb(null, require('../components/App'))
          })
      },
      childRoutes: [
        { 
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
          ]
        },

        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/user/add',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  const User = require('../components/UserUpgrade')
                  cb(null, User)
                })
              }
            }
          ]
        },

        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/user/edit/:userId',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  const User = require('../components/UserUpgrade')
                  cb(null, User)
                })
              }
            }
          ]
        },

        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/barang/add',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/BarangUpgrade'))
                })
              }
            }
          ]
        },

        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/barang/edit/:barangId',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/BarangUpgrade'))
                })
              }
            }
          ]
        },


        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/supplier',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/Supplier'))
                })
              }
            }
          ]
        },


        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/supplier/add',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/SupplierUpgrade'))
                })
              }
            }
          ]
        },

        { 
          childRoutes: [
            // Protected routes that don't share the dashboard UI
            { path: '/supplier/edit/:supplierId',
              getComponent: (location, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/SupplierUpgrade'))
                })
              }
            }
          ]
        },

      ]
    }

  ]
}

export default Routes
