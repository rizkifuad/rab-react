import { combineReducers } from 'redux'
import auth from './AuthReducer'
import user from './UserReducer'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const rootReducers = combineReducers({
    auth,
    user,
    routing: routerReducer

})

export default rootReducers
