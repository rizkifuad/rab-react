import CONSTANTS from '../constants'
import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import axios from 'axios'
import { loginUserFailure } from './ActionAuth'

const { 
  FETCHING, 
  GET_USERS_SUCCESS, 
  GET_USERS_FAILURE, 
  SELECT_USER, 

  PREPARE_UPGRADE_USER_SUCCESS, 
  PREPARE_UPGRADE_USER_FAILURE, 

  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,

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
      Dispatch(dispatch, getUsersSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getUsersFailure, err)
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
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
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


export function update(formData) {
  return dispatch => {
    const url = '/api/user/save'
    const data = serializeForm(formData)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_USER'))
    request.then(function(response) {
      Dispatch(dispatch, updateUserSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, updateUserFailure, err)
    })
  }
}


export function createUserSuccess(data) {
  browserHistory.push('/user')
  return {
    type: CREATE_USER_SUCCESS,
    payload: data
  }
}

export function createUserFailure(data) {
  return {
    type: CREATE_USER_FAILURE,
    payload: data
  }
}


export function create(formData) {
  return dispatch => {
    const url = '/api/user/save'
    const data = serializeForm(formData)
    const request = API().post(url, data)

    dispatch(fetching('CREATE_USER'))
    request.then(function(response) {
      Dispatch(dispatch, createUserSuccess,response.data)
    }).catch(function(err) {
      console.log(err)
      Fallback(dispatch, createUserFailure, err)
    })
  }
}
