import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import routes from './config/routes.js'
import Login from './components/Login'

require('../assets/css/material-lite-demo.css')
require('../assets/css/helpers.css')
require('../assets/css/main.css')

render(<Router history={browserHistory} routes={routes}/>, document.getElementById('main'))
//render(<Login/>, document.getElementById('main'))
