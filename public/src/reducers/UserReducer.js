import { createReducer } from '../utils'
import CONSTANTS from '../constants'

const { 
  GET_USERS, 
  GET_USERS_SUCCESS, 
  GET_USERS_FAILURE, 
  SELECT_USER, 
  PREPARE_UPGRADE_USER_SUCCESS, 
  PREPARE_UPGRADE_USER_FAILURE, 
  FETCHING, 
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
    error: ''
};

export default createReducer(initialState, {
    [FETCHING]: (state, payload) => {
        return Object.assign({}, state, {
          fetching: true,
          data: []
        });
    },
    [GET_USERS_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          upgradeData: {},
            data: payload,
            fetching: false
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
          error: ''
        });
    },
    [UPDATE_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
          fetching: false,
          error: ''
        });
    },
    [UPDATE_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
          fetching: false,
          error: payload
        });
    }
});

