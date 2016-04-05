import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING, 
  GET_BARANGS_SUCCESS, 
  GET_BARANGS_FAILURE, 
  SELECT_BARANG, 

  PREPARE_UPGRADE_BARANG_SUCCESS, 
  PREPARE_UPGRADE_BARANG_FAILURE, 

  CREATE_BARANG_SUCCESS,
  CREATE_BARANG_FAILURE,

  UPDATE_BARANG_SUCCESS, 
  UPDATE_BARANG_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING,
    payload: action
  }
}

export function getBarangsSuccess(data){
  return {
    type: GET_BARANGS_SUCCESS,
    payload: data
  }
}

export function getBarangsFailure(data) {
  return {
    type: GET_BARANGS_FAILURE,
    payload: data
  }
}

export function getBarangs() {
  return function(dispatch) {
    let request = API().get('/api/barang')
    dispatch(fetching('GET_BARANGS'))
    request.then(function(response) {
      Dispatch(dispatch, getBarangsSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getBarangsFailure, err)
    })
  }
}

export function selectBarangs(selected) {
  return {
    type: SELECT_BARANG,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_BARANG_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_BARANG_FAILURE
  }
}

export function prepareUpgrade(type, id) {
  let url =  '/api/barang/prepareUpgrade/' + id

  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_BARANG'))
    const request = API().get(url)
    request.then(function(response) {
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updateBarangSuccess(data) {
  browserHistory.push('/barang')
  return {
    type: UPDATE_BARANG_SUCCESS,
    payload: data
  }
}

export function updateBarangFailure(data) {
  return {
    type: UPDATE_BARANG_FAILURE,
    payload: data
  }
}


export function update(formData) {
  return dispatch => {
    const url = '/api/barang/save'
    const data = serializeForm(formData)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_BARANG'))
    request.then(function(response) {
      Dispatch(dispatch, updateBarangSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, updateBarangFailure, err)
    })
  }
}


export function createBarangSuccess(data) {
  browserHistory.push('/barang')
  return {
    type: CREATE_BARANG_SUCCESS,
    payload: data
  }
}

export function createBarangFailure(data) {
  return {
    type: CREATE_BARANG_FAILURE,
    payload: data
  }
}


export function create(formData) {
  return dispatch => {
    const url = '/api/barang/save'
    const data = serializeForm(formData)
    const request = API().post(url, data)

    dispatch(fetching('CREATE_BARANG'))
    request.then(function(response) {
      Dispatch(dispatch, createBarangSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, createBarangFailure, err)
    })
  }
}
