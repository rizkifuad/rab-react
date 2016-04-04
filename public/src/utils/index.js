import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { browserHistory } from 'react-router'
import { loginUserFailure } from '../actions/ActionAuth'

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}
export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}
const URL = "http://localhost:7000/"

export var ROOT_URL = URL
export function API() {
  axios.defaults.headers.common['Authorization'] =  localStorage.token;
  axios.defaults.baseURL = URL;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  return axios
}
export function serializeForm(refs) {
  const data = Object.assign({}, refs)
  for (var prop in data) {
    data[prop] = data[prop].value
  }

  return data
  
}
export function Dispatch(dispatcher, action, data) {
  dispatcher(action(data))
}

export function Fallback(dispatcher, action, response) {
    if (response.status == 401) {
      dispatcher(loginUserFailure(response.data))
      browserHistory.push('/login')
    } else {
      dispatcher(action(response))
    }
}
export function handleError(error) {

  console.log(error)
  if (!error.data) {
    error = {
      Error: true,
      Message: error.message
    }
  } else {
    error = {
      Error: error.data.Error,
      Message: error.data.Message
    }
  }

  return error
}
