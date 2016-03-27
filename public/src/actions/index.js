import CONSTANTS from '../constants'
import { browserHistory } from 'react-router'
import axios from 'axios'

const ROOT_URL = "http://localhost:7000/"
const {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE} = CONSTANTS
//console.log(a)

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    }
}
export function loginUserSuccess(resp) {
    localStorage.setItem('token', resp.Token)
    return {
        type: LOGIN_USER_SUCCESS,
        payload: resp
    }
}

export function loginUserFailure(error) {
    delete localStorage.token
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            status: false,
            statusText: error.message ? error.message : "Incorrect username or password"
        }
    }
}

export function authenticate(user) {
    return function (dispatch) {
        dispatch(loginUserRequest())
        console.log('Authenticating...')
        const url = `${ROOT_URL}auth`
        axios({
            method: 'POST',
            url: url,
            data: user,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            const redirect = user.next ? user.next : '/'
            dispatch(loginUserSuccess(resp.data))
            browserHistory.push(redirect)
        }).catch(function(err) {
            dispatch(loginUserFailure(err))
        })
    }
}
