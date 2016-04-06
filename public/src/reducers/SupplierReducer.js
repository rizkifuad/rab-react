import { handleError, createReducer } from '../utils'
import CONSTANTS from '../constants'


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
    [GET_SUPPLIERS_SUCCESS]: (state, payload) => {
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
    [SELECT_SUPPLIER]: (state, payload) => {
        return Object.assign({}, state, {
          selected: payload
        });
    },
    [PREPARE_UPGRADE_SUPPLIER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: payload,
          fetching: false,
          status: {
            error: false,
            message: ''
          }
        });
    },
    [UPDATE_SUPPLIER_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [UPDATE_SUPPLIER_FAILURE]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_SUPPLIER_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_SUPPLIER_FAILURE]: (state, payload) => {
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

