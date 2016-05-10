import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING, 
  GET_PROJECT_ORDERS_SUCCESS, 
  GET_PROJECT_ORDERS_FAILURE, 
  SELECT_PROJECT_ORDER, 

  PREPARE_UPGRADE_PROJECT_ORDER_SUCCESS, 
  PREPARE_UPGRADE_PROJECT_ORDER_FAILURE, 

  CREATE_PROJECT_ORDER_SUCCESS,
  CREATE_PROJECT_ORDER_FAILURE,

  APPROVE_ORDER_SUCCESS,
  APPROVE_ORDER_FAILURE,


  CETAK_ORDER_SUCCESS,
  CETAK_ORDER_FAILURE,

  UPDATE_PROJECT_ORDER_SUCCESS, 
  UPDATE_PROJECT_ORDER_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING,
    payload: action
  }
}

export function getProjectOrdersSuccess(data){
  return {
    type: GET_PROJECT_ORDERS_SUCCESS,
    payload: data
  }
}

export function getProjectOrdersFailure(data) {
  return {
    type: GET_PROJECT_ORDERS_FAILURE,
    payload: data
  }
}



export function getProjectOrders() {
  return function(dispatch) {
    let request = API().get('/api/order')
    dispatch(fetching('GET_PROJECT_ORDERS'))
    request.then(function(response) {
      Dispatch(dispatch, getProjectOrdersSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getProjectOrdersFailure, err)
    })
  }
}

export function selectProjectOrders(selected) {
  return {
    type: SELECT_PROJECT_ORDER,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_PROJECT_ORDER_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_PROJECT_ORDER_FAILURE
  }
}

export function prepareUpgrade(type, id) {
  let url = ''
  switch (type) {
    case 'CREATE':
      url =  '/api/project_order/prepareUpgrade'
      break;

    case 'UPDATE':
      url =  '/api/project_order/prepareUpgrade/' + id
      break;
    
    default:
  }

  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_PROJECT_ORDER'))
    const request = API().get(url)
    request.then(function(response) {
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updateProjectOrderSuccess(data) {
  return {
    type: UPDATE_PROJECT_ORDER_SUCCESS,
    payload: data
  }
}

export function updateProjectOrderFailure(data) {
  return {
    type: UPDATE_PROJECT_ORDER_FAILURE,
    payload: data
  }
}


export function update(formData, barangs) {
  console.log(barangs)
  return dispatch => {
    const url = '/api/project_order/save'
    const data = Object.assign(serializeForm(formData), barangs)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_PROJECT_ORDER'))
    request.then(function(response) {
      Dispatch(dispatch, updateProjectOrderSuccess, response.data)
      browserHistory.push('/project_order')
    }).catch(function(err) {
      Fallback(dispatch, updateProjectOrderFailure, err)
    })
  }
}


export function createProjectOrderSuccess(data) {
  //window.location.reload()
  return {
    type: CREATE_PROJECT_ORDER_SUCCESS,
    payload: data
  }
}

export function createProjectOrderFailure(data) {
  return {
    type: CREATE_PROJECT_ORDER_FAILURE,
    payload: data
  }
}


export function create(formData) {
  return dispatch => {
    const url = '/api/project_order/save'
    const data = formData
    const request = API().post(url, data)

    dispatch(fetching('CREATE_PROJECT_ORDER'))
    //checking dl
    API().get('/api/project_order/check/' + formData.anggaran_id + '/' + formData.barang_id + '/' + formData.jumlah)
    .then(function(res) {
      if (res.data.Error) {
        let r = confirm(res.data.Message)
        if (r == true) {
          request.then(function(response) {
            Dispatch(dispatch, createProjectOrderSuccess,response.data)
            dispatch(prepareUpgrade('UPDATE', formData.anggaran_id))
          }).catch(function(err) {
            Fallback(dispatch, createProjectOrderFailure, err)
          })
        } else {

        }
      }
    })
  }
}

export function approveOrderSuccess(data) {
  return {
    type: APPROVE_ORDER_SUCCESS,
    payload: data
  }
}


export function approveOrderFailure(data) {
  return {
    type: APPROVE_ORDER_FAILURE,
    payload: data
  }
}

export function approveOrder(id) {
  return function(dispatch) {
    let request = API().get('/api/project_order/approve/'+id)
    dispatch(fetching('APPROVE_ORDER'))
    request.then(function(response) {
      Dispatch(dispatch, approveOrderSuccess, response)
      dispatch(prepareUpgrade('UPDATE', response.data.AnggaranId))
    }).catch(function(err) {
      Fallback(dispatch, approveOrderFailure, err)
    })
  }
}


export function cetakOrderSuccess(data) {
  return {
    type: CETAK_ORDER_SUCCESS,
    payload: data
  }
}


export function cetakOrderFailure(data) {
  return {
    type: CETAK_ORDER_FAILURE,
    payload: data
  }
}

export function cetakOrder(id) {
  return function(dispatch) {
    let request = API().get('/api/project_order/cetak/'+id)
    dispatch(fetching('CETAK_ORDER'))
    request.then(function(response) {
      Dispatch(dispatch, cetakOrderSuccess, response)
      dispatch(prepareUpgrade('UPDATE', response.data.AnggaranId))
    }).catch(function(err) {
      Fallback(dispatch, cetakOrderFailure, err)
    })
  }
}
