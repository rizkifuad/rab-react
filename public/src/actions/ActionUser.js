import CONSTANTS from '../constants'
import { browserHistory } from 'react-router'
import { API, serializeForm } from '../utils/'
import axios from 'axios'
import { loginUserFailure } from './ActionAuth'

const { 
  GET_USERS, 
  GET_USERS_SUCCESS, 
  GET_USERS_FAILURE, 
  SELECT_USER, 
  PREPARE_UPGRADE_USER_SUCCESS, 
  PREPARE_UPGRADE_USER_FAILURE, 
  FETCHING, 
  UPDATE_USER_SUCCESS, 
  UPDATE_USER_FAILURE } = CONSTANTS

export function fetching(action) {
  return {
    type: FETCHING,
    payload: action
  }
}

export function getUsersSuccess(data){
  return {
    type: GET_USERS_SUCCESS,
    payload: data
  }
}

export function getUsersFailure(data) {
  return {
    type: GET_USERS_FAILURE,
    payload: data
  }
}

export function getUsers() {
  return function(dispatch) {
    let request = API().get('/api/user')
    dispatch(fetching('GET_USERS'))
    request.then(function(response) {
      dispatch(getUsersSuccess(response.data))
    }).catch(function(err) {
      Dispatch(dispatch, getUsersFailure, err)
    })
  }
}

export function selectUsers(selected) {
  return {
    type: SELECT_USER,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_USER_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_USER_FAILURE
  }
}

export function prepareUpgrade(type, id) {
  let url = ''
  switch (type) {
    case 'CREATE':
      url =  '/api/user/prepareUpgrade'
      break;

    case 'UPDATE':
      url =  '/api/user/prepareUpgrade/' + id
      break;
    
    default:
  }


  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_USER'))
    const request = API().get(url)
    request.then(function(response) {
      dispatch(prepareUpgradeSuccess(response.data))
    }).catch(function(err) {
      Dispatch(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updateUserSuccess(data) {
  browserHistory.push('/user')
  return {
    type: UPDATE_USER_SUCCESS,
    payload: data
  }
}

export function updateUserFailure(data) {
  return {
    type: UPDATE_USER_FAILURE,
    payload: data
  }
}
function Dispatch(dispatcher, action, response) {
    if (response.status == 401) {
      dispatcher(loginUserFailure(Error(response.data)))
      browserHistory.push('/login')
    } else {
      dispatcher(action(response.data))
    }
}


export function update(formData) {
  return dispatch => {
    const url = '/api/user/save'
    const data = serializeForm(formData)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_USER'))
    request.then(function(response) {
      dispatch(updateUserSuccess(response.data))
    }).catch(function(err) {
      Dispatch(dispatch, updateUserFailure, err)
    })
  }
}
