import { browserHistory } from 'react-router'
import { API, serializeForm, Dispatch, Fallback } from '../utils/'
import CONSTANTS from '../constants/index'

const { 
  FETCHING_REPORT,
  GET_REPORTS_SUCCESS, 
  GET_REPORTS_FAILURE, 
  SELECT_REPORT, 

  PREPARE_UPGRADE_REPORT_SUCCESS, 
  PREPARE_UPGRADE_REPORT_FAILURE, 

  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_FAILURE,

  UPDATE_REPORT_SUCCESS, 
  UPDATE_REPORT_FAILURE } = CONSTANTS


export function fetching(action) {
  return {
    type: FETCHING_REPORT,
    payload: action
  }
}

export function getReportsSuccess(data){
  return {
    type: GET_REPORTS_SUCCESS,
    payload: data
  }
}

export function getReportsFailure(data) {
  return {
    type: GET_REPORTS_FAILURE,
    payload: data
  }
}

export function getReports(id) {
  return function(dispatch) {
    let request = API().get('/api/report/'+id)
    dispatch(fetching('GET_REPORTS'))
    request.then(function(response) {
      Dispatch(dispatch, getReportsSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, getReportsFailure, err)
    })
  }
}

export function selectReports(selected) {
  return {
    type: SELECT_REPORT,
    payload: selected
  }
}

function prepareUpgradeSuccess(data) {
  return {
    type: PREPARE_UPGRADE_REPORT_SUCCESS,
    payload: data
  }
}

function prepareUpgradeFailure(err) {
  return {
    type: PREPARE_UPGRADE_REPORT_FAILURE
  }
}

export function prepareUpgrade(type, id, cetak) {
  let url =  '/api/pembayaran/prepareUpgrade/' + id + '/' + cetak

  return dispatch => {
  dispatch(fetching('PREPARE_UPGRADE_REPORT'))
    const request = API().get(url)
    request.then(function(response) {
      Dispatch(dispatch, prepareUpgradeSuccess, response.data)
    }).catch(function(err) {
      Fallback(dispatch, prepareUpgradeFailure, err)
    })
  }

}


export function updateReportSuccess(data) {
  return {
    type: UPDATE_REPORT_SUCCESS,
    payload: data
  }
}

export function updateReportFailure(data) {
  return {
    type: UPDATE_REPORT_FAILURE,
    payload: data
  }
}


export function update(formData, add) {
  return dispatch => {
    const url = '/api/pembayaran/save'
    const data = Object.assign(serializeForm(formData), add)
    const request = API().put(url, data)

    dispatch(fetching('UPDATE_REPORT'))
    request.then(function(response) {
      Dispatch(dispatch, updateReportSuccess, response.data)
      dispatch(prepareUpgrade('', data.anggaran_id, data.cetak))
    }).catch(function(err) {
      Fallback(dispatch, updateReportFailure, err)
    })
  }
}


export function createReportSuccess(data) {
  browserHistory.push('/pembayaran')
  return {
    type: CREATE_REPORT_SUCCESS,
    payload: data
  }
}

export function createReportFailure(data) {
  return {
    type: CREATE_REPORT_FAILURE,
    payload: data
  }
}


export function create(formData) {
  return dispatch => {
    const url = '/api/pembayaran/save'
    const data = serializeForm(formData)
    const request = API().post(url, data)

    dispatch(fetching('CREATE_REPORT'))
    request.then(function(response) {
      Dispatch(dispatch, createReportSuccess,response.data)
    }).catch(function(err) {
      Fallback(dispatch, createReportFailure, err)
    })
  }
}
