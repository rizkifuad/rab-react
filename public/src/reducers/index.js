import { combineReducers } from 'redux'
import LoginReducer from './LoginReducer'

const rootReducers = combineReducers({
    login: LoginReducer
})
