import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING_PEMBAYARAN,
  GET_PEMBAYARANS_SUCCESS, 
  GET_PEMBAYARANS_FAILURE, 
  SELECT_PEMBAYARAN, 

  PREPARE_UPGRADE_PEMBAYARAN_SUCCESS, 
  PREPARE_UPGRADE_PEMBAYARAN_FAILURE, 

  CREATE_PEMBAYARAN_SUCCESS,
  CREATE_PEMBAYARAN_FAILURE,

  UPLOAD_GAMBAR, 
  UPLOAD_GAMBAR_SUCCESS, 
  UPLOAD_GAMBAR_FAILURE,

  UPDATE_PEMBAYARAN_SUCCESS, 
  UPDATE_PEMBAYARAN_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING_PEMBAYARAN,
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

export function getPembayarans(id) {
  return function(dispatch) {
    let request = API().get('/api/pembayaran/'+id)
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

export function prepareUpgrade(type, id, cetak) {
  let url =  '/api/pembayaran/prepareUpgrade/' + id + '/' + cetak

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


export function update(formData, add) {
  return dispatch => {
    const url = '/api/pembayaran/save'
    const data = Object.assign(serializeForm(formData), add)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_PEMBAYARAN'))
    request.then(function(response) {
      Dispatch(dispatch, updatePembayaranSuccess, response.data)
      dispatch(prepareUpgrade('', data.anggaran_id, data.cetak))
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


export function uploadGambarSuccess(data) {
  return {
    type: UPLOAD_GAMBAR_SUCCESS,
    payload: data
  }
}


export function uploadGambarFailure(data) {
  return {
    type: UPLOAD_GAMBAR_FAILURE,
    payload: data
  }
}

export function uploadGambar(formData, anggaranId, cetak) {
  console.log('formdata',formData)
  return dispatch => {
    const url = '/api/pembayaran/upload'
    //const data = serializeForm(formData)
    const config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    const request = API().post(url, formData.file, config)


    dispatch(fetching('UPLOAD_GAMBAR'))
    request.then(function(response) {
      Dispatch(dispatch, uploadGambarSuccess,response.data)
      dispatch(prepareUpgrade('', anggaranId, cetak))
    }).catch(function(err) {
      Fallback(dispatch, uploadGambarFailure, err)
    })
  }
}
