import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import thunk from 'redux-thunk';

import routes from './config/routes.js'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import { createHistory } from 'history';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import ReduxPromise from 'redux-promise'


import Login from './components/Login'
import reducers from './reducers'


let createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f

)(createStore)

const store = createStoreWithMiddleware(reducers)
const history = syncHistoryWithStore(browserHistory, store)


require('../assets/css/material-lite-demo.css')
require('../assets/css/helpers.css')
require('../assets/css/main.css')

render(
    (
        <Provider store={store}>
        <Router history={history} routes={routes}/>
        </Provider>
    )
    , document.getElementById('main'))
//render(<Login/>, document.getElementById('main'))
