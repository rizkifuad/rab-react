import { handleError, createReducer } from '../utils'
import CONSTANTS from '../constants'
import jwtDecode from 'jwt-decode';


const {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER} = CONSTANTS
const initialState = {
    token: null,
    username: null,
    isAuthenticated: false,
    isAuthenticating: false,
    status: {
      error: false,
      message: ''
    }

};
export default createReducer(initialState, {
    [LOGIN_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'status': {
              error: false,
              message: ''
            }
        });
    },
    [LOGIN_USER_SUCCESS]: (state, payload) => {
      console.log(payload.Message)
      console.log(jwtDecode(payload.Message))
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'token': payload.Message,
            'username': jwtDecode(payload.Message).username,
        });

    },
    [LOGIN_USER_FAILURE]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'token': null,
            'username': null,
            'status': {
              error: payload.Error,
              message: payload.Message
            }
        });
    },
    [LOGOUT_USER]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticated': false,
            'token': null,
            'username': null,
            'status': {
              error: false,
              message: "You have been successfully logout"
            }
        });
    }
});

