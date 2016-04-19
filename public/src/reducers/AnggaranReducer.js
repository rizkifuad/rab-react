import { handleError, createReducer } from '../utils'
import CONSTANTS from '../constants'


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
    [GET_ANGGARANS_SUCCESS]: (state, payload) => {
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
    [SELECT_ANGGARAN]: (state, payload) => {
        return Object.assign({}, state, {
          selected: payload
        });
    },
    [PREPARE_UPGRADE_ANGGARAN_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: payload,
          fetching: false,
          status: {
            error: false,
            message: ''
          }
        });
    },
    [UPDATE_ANGGARAN_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [UPDATE_ANGGARAN_FAILURE]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_ANGGARAN_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_ANGGARAN_FAILURE]: (state, payload) => {
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

