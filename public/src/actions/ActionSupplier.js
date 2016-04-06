import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING, 
  GET_SUPPLIERS_SUCCESS, 
  GET_SUPPLIERS_FAILURE, 
  SELECT_SUPPLIER, 

  PREPARE_UPGRADE_SUPPLIER_SUCCESS, 
  PREPARE_UPGRADE_SUPPLIER_FAILURE, 

  CREATE_SUPPLIER_SUCCESS,
  CREATE_SUPPLIER_FAILURE,

  UPDATE_SUPPLIER_SUCCESS, 
  UPDATE_SUPPLIER_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING,
    payload: action
  }
}

export function getSuppliersSuccess(data){
  return {
    type: GET_SUPPLIERS_SUCCESS,
    payload: data
  }
}

export function getSuppliersFailure(data) {
  return {
    type: GET_SUPPLIERS_FAILURE,
    payload: data
  }
}

export function getSuppliers() {
  return function(dispatch) {
    let request = API().get('/api/supplier')
    dispatch(fetching('GET_SUPPLIERS'))
    request.then(function(response) {
      Dispatch(dispatch, getSuppliersSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getSuppliersFailure, err)
    })
  }
}

export function selectSuppliers(selected) {
  return {
    type: SELECT_SUPPLIER,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_SUPPLIER_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_SUPPLIER_FAILURE
  }
}

export function prepareUpgrade(type, id) {
  let url =  '/api/supplier/prepareUpgrade/' + id

  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_SUPPLIER'))
    const request = API().get(url)
    request.then(function(response) {
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updateSupplierSuccess(data) {
  browserHistory.push('/supplier')
  return {
    type: UPDATE_SUPPLIER_SUCCESS,
    payload: data
  }
}

export function updateSupplierFailure(data) {
  return {
    type: UPDATE_SUPPLIER_FAILURE,
    payload: data
  }
}


export function update(formData) {
  return dispatch => {
    const url = '/api/supplier/save'
    const data = serializeForm(formData)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_SUPPLIER'))
    request.then(function(response) {
      Dispatch(dispatch, updateSupplierSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, updateSupplierFailure, err)
    })
  }
}


export function createSupplierSuccess(data) {
  browserHistory.push('/supplier')
  return {
    type: CREATE_SUPPLIER_SUCCESS,
    payload: data
  }
}

export function createSupplierFailure(data) {
  return {
    type: CREATE_SUPPLIER_FAILURE,
    payload: data
  }
}


export function create(formData) {
  return dispatch => {
    const url = '/api/supplier/save'
    const data = serializeForm(formData)
    const request = API().post(url, data)

    dispatch(fetching('CREATE_SUPPLIER'))
    request.then(function(response) {
      Dispatch(dispatch, createSupplierSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, createSupplierFailure, err)
    })
  }
}
