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
    return   constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function API() {
  axios.defaults.headers.common['Authorization'] =  localStorage.token;
  axios.defaults.baseURL = process.env.ROOT_API;
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


export function printUlang(dataCetak) {
  console.log('cok', dataCetak)
   var newWin= window.open("");
   newWin.document.write('<link rel="stylesheet" href="http://localhost:3000/assets/css/print.css">')
   newWin.document.write('<h1 align="center">PT. Putra Rindu Serumpun</h1><br><br>')
   console.log('dataCetak', dataCetak)

   if (dataCetak) {
     newWin.document.write('\
     <div class="left text-left"><strong>TIPE: </strong></div>\
     <div class="right text-left"><strong>PROYEK: </strong>'+ dataCetak.detail.Lokasi +'<br><br>\
     <strong>BLOK: </strong>'+ dataCetak.detail.BlokRumah +'\
     </div>\
     <br>\
     <br>\
     <br>\
     <br>\
     <br>\
       <table style="width:100%;">\
        <thead>\
          <tr>\
            <th>No</th>\
            <th>Nama Barang</th>\
            <th>Jumlah</th>\
            <th>Keterangan</th>\
            <th>Total</th>\
          </tr>\
        </thead>\
        <tbody>\
       ');
     for (var i = 0, len = dataCetak.order.length; i < len; i++) {
       var item = dataCetak.order[i]
       var no = i + 1

       const b = dataCetak.barang.find(function(bar) {
         return parseInt(bar.BarangId) == parseInt(item.BarangId)
       })

       newWin.document.write('\
       <tr>\
        <td>'+ no +'</td>\
        <td>'+ b.NamaBarang +'</td>\
        <td>'+ item.Jumlah +'</td>\
        <td>'+ item.Kegunaan +'</td>\
        <td></td>\
       </tr>\
       ')
     }
     newWin.document.write('</tbody></table><br><br>');
     newWin.document.write('<div class="right"><strong>Pekanbaru,                 </strong></div>');
     newWin.document.write('<br><br><br><div class="left"><strong>Disetujui,</strong><br><br><br>')
     newWin.document.write(dataCetak.user+"</div>")
     newWin.document.write('<div class="right"><strong>Dipesan oleh,</strong><br><br><br>')
   }
   setTimeout(function() {
     newWin.print();
   }, 500)
   //newWin.close();
}

export function print(divName, dataCetak) {
  console.log('cok', dataCetak)
 var divToPrint=document.getElementById(divName);
   var newWin= window.open("");
   newWin.document.write('<link rel="stylesheet" href="http://localhost:3000/assets/css/print.css">')
   newWin.document.write('<h1 align="center">PT. Putra Rindu Serumpun</h1>')
   newWin.document.write(divToPrint.outerHTML);
   console.log('dataCetak', dataCetak)
   if (dataCetak) {
     var r = newWin.document.querySelectorAll('tbody tr.print-row');
     var a = newWin.document.querySelectorAll('tbody tr.print-'+dataCetak.cetak);

     for (var i = 0, len = r.length; i < len; i++) {
       r[i].classList.remove('print-row')
     }
     for (var i = 0, len = a.length; i < len; i++) {
       a[i].classList.add('print-row')
     }
     newWin.document.write('<div class="right">Pekanbaru,                 </div>');
     newWin.document.write('<br><br><br>Disetujui,<br><br><br>')
     newWin.document.write(dataCetak.user)
   }
   setTimeout(function() {
     newWin.print();
   }, 500)
   //newWin.close();
}

export function toRp(string) {
  if (!string) {
    return 'Rp 0'
  }
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
