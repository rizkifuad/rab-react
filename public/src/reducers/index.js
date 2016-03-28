import { combineReducers } from 'redux'
import auth from './AuthReducer'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const rootReducers = combineReducers({
    auth,
    routing: routerReducer

})

export default rootReducers
