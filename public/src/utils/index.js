import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { browserHistory } from 'react-router'
import { loginUserFailure } from '../actions/ActionAuth'
import { ROOT_URL } from '../config'

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}
export function createConstants(...constants) {
    return   constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function API() {
  axios.defaults.headers.common['Authorization'] =  localStorage.token;
  axios.defaults.baseURL = ROOT_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  return axios
}
export function serializeForm(refs) {
  const data = Object.assign({}, refs)
  for (var prop in data) {
    console.log(prop)
    console.log(data[prop])
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

export function createRoutes(path, component) {
  return [
    { path: path,
      getComponent: (location, cb) => {
        require.ensure([], (require) => {
          cb(null, require(component))
        })
      }
    }
  ]
}

export function print(divName, cetak) {
 var divToPrint=document.getElementById(divName);
   var newWin= window.open("");
   newWin.document.write('<link rel="stylesheet" href="http://localhost:3000/assets/css/print.css">')
   newWin.document.write(divToPrint.outerHTML);
   if (cetak) {
     var r = newWin.document.querySelectorAll('tbody tr.print-row');
     var a = newWin.document.querySelectorAll('tbody tr.print-'+cetak);

     for (var i = 0, len = r.length; i < len; i++) {
       r[i].classList.remove('print-row')
     }
     for (var i = 0, len = a.length; i < len; i++) {
       a[i].classList.add('print-row')
     }
   }
   setTimeout(function() {
     newWin.print();
   }, 500)
   //newWin.close();
}

export function toRp(string) {
 string = string+''
 string = string.split('')
 for (var i = string.length-3; i > 0; i-=3) {
   string[i] = '.' + string[i]
 }
 return 'Rp ' + string.join('')
}

export function limit(_this) {

    const auth = _this.props.auth

    return auth.role == 'pegawai' ? 'hide' : ''
}
