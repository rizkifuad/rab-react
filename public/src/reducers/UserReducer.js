import { handleError, createReducer } from '../utils'
import CONSTANTS from '../constants'


const { 
  FETCHING_USER, 
  GET_USERS_SUCCESS, 
  GET_USERS_FAILURE, 
  SELECT_USER, 

  PREPARE_UPGRADE_USER_SUCCESS, 
  PREPARE_UPGRADE_USER_FAILURE, 

  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,

  UPDATE_USER_SUCCESS, 
  UPDATE_USER_FAILURE } = CONSTANTS

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
    [FETCHING_USER]: (state, payload) => {
        return Object.assign({}, state, {
          fetching: true,
          data: []
        });
    },
    [GET_USERS_SUCCESS]: (state, payload) => {
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
    [SELECT_USER]: (state, payload) => {
        return Object.assign({}, state, {
          selected: payload
        });
    },
    [PREPARE_UPGRADE_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: payload,
          fetching: false,
          status: {
            error: false,
            message: ''
          }
        });
    },
    [UPDATE_USER_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [UPDATE_USER_FAILURE]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_USER_SUCCESS]: (state, payload) => {
      payload = handleError(payload)
        return Object.assign({}, state, {
          fetching: false,
          status: {
            error: payload.Error,
            message: payload.Message
          }
        });
    },
    [CREATE_USER_FAILURE]: (state, payload) => {
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

