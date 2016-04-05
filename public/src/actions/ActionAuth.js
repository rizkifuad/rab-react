import { browserHistory } from 'react-router'
import axios from 'axios'
//import { ROOT_URL } from '../config/'
import { CONSTANTS } from '../constants'
console.log(CONSTANTS)

//const {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER} = CONSTANTS

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    }
}
export function loginUserSuccess(resp) {
  localStorage.setItem('token', resp.Message)
  return {
    type: LOGIN_USER_SUCCESS,
    payload: resp
  }
}


export function loginUserFailure(error) {
    delete localStorage.token
    return {
        type: LOGIN_USER_FAILURE,
        payload: error  
    }
}


export function authenticate(user) {
    return function (dispatch) {
        dispatch(loginUserRequest())
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

export function logout() {
    delete localStorage.token
    browserHistory.push('/login')
    return {
        type: LOGOUT_USER,
    }
}
export function checkAuth() {
    return function(dispatch) {
        if (!!localStorage.token) {
          let resp = {Message : localStorage.token}
          const url = `${ROOT_URL}checkToken`
          axios({
            method: 'POST',
            url: url,
            data: {token: resp.Message},
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function(response) {
            dispatch(loginUserSuccess(resp))
          }).catch(function(err) {
            dispatch(loginUserFailure(err))
            browserHistory.push('/login')
          })
        } else {
            browserHistory.push('/login')
        }

    }
}

