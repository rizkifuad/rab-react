import { handleError, createReducer } from '../utils'
import CONSTANTS from '../constants'


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
    [FETCHING]: (state, payload) => {
        return Object.assign({}, state, {
          fetching: true,
          data: []
        });
    },
    [GET_BARANGS_SUCCESS]: (state, payload) => {
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
    [SELECT_BARANG]: (state, payload) => {
        return Object.assign({}, state, {
          selected: payload
        });
    },
    [PREPARE_UPGRADE_BARANG_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: payload,
          fetching: false,
          status: {
            error: false,
            message: ''
          }
        });
    },
    [UPDATE_BARANG_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [UPDATE_BARANG_FAILURE]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_BARANG_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_BARANG_FAILURE]: (state, payload) => {
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

