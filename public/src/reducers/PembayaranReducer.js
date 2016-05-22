import { handleError, createReducer } from '../utils'
import CONSTANTS from '../constants'


const { 
  FETCHING_PEMBAYARAN, 
  GET_PEMBAYARANS_SUCCESS, 
  GET_PEMBAYARANS_FAILURE, 
  SELECT_PEMBAYARAN, 

  PREPARE_UPGRADE_PEMBAYARAN_SUCCESS, 
  PREPARE_UPGRADE_PEMBAYARAN_FAILURE, 

  CREATE_PEMBAYARAN_SUCCESS,
  CREATE_PEMBAYARAN_FAILURE,

  UPDATE_PEMBAYARAN_SUCCESS, 
  UPDATE_PEMBAYARAN_FAILURE } = CONSTANTS

const initialState = {
    terms: '',
    sort: 'DESC',
    sortby: 'createdAt',
    page: 1,
    data: [],
    selected: [],
    upgradeData: {},
    fetching: true,
    status: {
      error: false,
      message: ''
    }
};

export default createReducer(initialState, {
    [FETCHING_PEMBAYARAN]: (state, payload) => {
        return Object.assign({}, state, {
          fetching: true,
          data: []
        });
    },
    [GET_PEMBAYARANS_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: {},
          data: payload,
          fetching: false,
          status: {
            error: false,
            message: ''
          }
        });
    },
    [SELECT_PEMBAYARAN]: (state, payload) => {
        return Object.assign({}, state, {
          selected: payload
        });
    },
    [PREPARE_UPGRADE_PEMBAYARAN_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: payload,
          fetching: false,
          status: {
            error: false,
            message: ''
          }
        });
    },
    [UPDATE_PEMBAYARAN_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [UPDATE_PEMBAYARAN_FAILURE]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_PEMBAYARAN_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_PEMBAYARAN_FAILURE]: (state, payload) => {
      payload = handleError(payload)
      console.log(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    }
});

