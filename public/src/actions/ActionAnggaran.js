import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING, 
  GET_ANGGARANS_SUCCESS, 
  GET_ANGGARANS_FAILURE, 
  SELECT_ANGGARAN, 

  PREPARE_UPGRADE_ANGGARAN_SUCCESS, 
  PREPARE_UPGRADE_ANGGARAN_FAILURE, 

  CREATE_ANGGARAN_SUCCESS,
  CREATE_ANGGARAN_FAILURE,

  UPDATE_ANGGARAN_SUCCESS, 
  UPDATE_ANGGARAN_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING,
    payload: action
  }
}

export function getAnggaransSuccess(data){
  return {
    type: GET_ANGGARANS_SUCCESS,
    payload: data
  }
}

export function getAnggaransFailure(data) {
  return {
    type: GET_ANGGARANS_FAILURE,
    payload: data
  }
}

export function getAnggarans() {
  return function(dispatch) {
    let request = API().get('/api/anggaran')
    dispatch(fetching('GET_ANGGARANS'))
    request.then(function(response) {
      Dispatch(dispatch, getAnggaransSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getAnggaransFailure, err)
    })
  }
}

export function selectAnggarans(selected) {
  return {
    type: SELECT_ANGGARAN,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_ANGGARAN_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_ANGGARAN_FAILURE
  }
}

export function prepareUpgrade(type, id) {
  let url = ''
  switch (type) {
    case 'CREATE':
      url =  '/api/anggaran/prepareUpgrade'
      break;

    case 'UPDATE':
      url =  '/api/anggaran/prepareUpgrade/' + id
      break;
    
    default:
  }

  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_ANGGARAN'))
    const request = API().get(url)
    request.then(function(response) {
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updateAnggaranSuccess(data) {
  return {
    type: UPDATE_ANGGARAN_SUCCESS,
    payload: data
  }
}

export function updateAnggaranFailure(data) {
  return {
    type: UPDATE_ANGGARAN_FAILURE,
    payload: data
  }
}


export function update(formData, barangs) {
  console.log(barangs)
  return dispatch => {
    const url = '/api/anggaran/save'
    const data = Object.assign(serializeForm(formData), barangs)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_ANGGARAN'))
    request.then(function(response) {
      Dispatch(dispatch, updateAnggaranSuccess, response.data)
      browserHistory.push('/anggaran')
    }).catch(function(err) {
      Fallback(dispatch, updateAnggaranFailure, err)
    })
  }
}


export function createAnggaranSuccess(data) {
  browserHistory.push('/anggaran')
  return {
    type: CREATE_ANGGARAN_SUCCESS,
    payload: data
  }
}

export function createAnggaranFailure(data) {
  return {
    type: CREATE_ANGGARAN_FAILURE,
    payload: data
  }
}


export function create(formData, barangs) {
  return dispatch => {
    const url = '/api/anggaran/save'
    const data = Object.assign(serializeForm(formData), barangs)
    const request = API().post(url, data)

    dispatch(fetching('CREATE_ANGGARAN'))
    request.then(function(response) {
      Dispatch(dispatch, createAnggaranSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, createAnggaranFailure, err)
    })
  }
}
