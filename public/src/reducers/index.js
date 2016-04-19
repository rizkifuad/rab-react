import { combineReducers } from 'redux'
import auth from './AuthReducer'
import user from './UserReducer'
import barang from './BarangReducer'
import supplier from './SupplierReducer'
import anggaran from './AnggaranReducer'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const rootReducers = combineReducers({
    auth,
    user,
    barang,
    supplier,
    anggaran,
    routing: routerReducer

})

export default rootReducers
