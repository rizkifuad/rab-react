import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING, 
  GET_PEMBAYARANS_SUCCESS, 
  GET_PEMBAYARANS_FAILURE, 
  SELECT_PEMBAYARAN, 

  PREPARE_UPGRADE_PEMBAYARAN_SUCCESS, 
  PREPARE_UPGRADE_PEMBAYARAN_FAILURE, 

  CREATE_PEMBAYARAN_SUCCESS,
  CREATE_PEMBAYARAN_FAILURE,

  UPDATE_PEMBAYARAN_SUCCESS, 
  UPDATE_PEMBAYARAN_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING,
    payload: action
  }
}

export function getPembayaransSuccess(data){
  return {
    type: GET_PEMBAYARANS_SUCCESS,
    payload: data
  }
}

export function getPembayaransFailure(data) {
  return {
    type: GET_PEMBAYARANS_FAILURE,
    payload: data
  }
}

export function getPembayarans() {
  return function(dispatch) {
    let request = API().get('/api/pembayaran')
    dispatch(fetching('GET_PEMBAYARANS'))
    request.then(function(response) {
      Dispatch(dispatch, getPembayaransSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getPembayaransFailure, err)
    })
  }
}

export function selectPembayarans(selected) {
  return {
    type: SELECT_PEMBAYARAN,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_PEMBAYARAN_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_PEMBAYARAN_FAILURE
  }
}

export function prepareUpgrade(type, id) {
  let url =  '/api/pembayaran/prepareUpgrade/' + id

  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_PEMBAYARAN'))
    const request = API().get(url)
    request.then(function(response) {
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updatePembayaranSuccess(data) {
  browserHistory.push('/pembayaran')
  return {
    type: UPDATE_PEMBAYARAN_SUCCESS,
    payload: data
  }
}

export function updatePembayaranFailure(data) {
  return {
    type: UPDATE_PEMBAYARAN_FAILURE,
    payload: data
  }
}


export function update(formData) {
  return dispatch => {
    const url = '/api/pembayaran/save'
    const data = serializeForm(formData)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_PEMBAYARAN'))
    request.then(function(response) {
      Dispatch(dispatch, updatePembayaranSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, updatePembayaranFailure, err)
    })
  }
}


export function createPembayaranSuccess(data) {
  browserHistory.push('/pembayaran')
  return {
    type: CREATE_PEMBAYARAN_SUCCESS,
    payload: data
  }
}

export function createPembayaranFailure(data) {
  return {
    type: CREATE_PEMBAYARAN_FAILURE,
    payload: data
  }
}


export function create(formData) {
  return dispatch => {
    const url = '/api/pembayaran/save'
    const data = serializeForm(formData)
    const request = API().post(url, data)

    dispatch(fetching('CREATE_PEMBAYARAN'))
    request.then(function(response) {
      Dispatch(dispatch, createPembayaranSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, createPembayaranFailure, err)
    })
  }
}
