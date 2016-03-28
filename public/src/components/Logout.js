import React from 'react'
import * as actionCreators from '../actions/ActionAuth'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Logout = React.createClass({
  componentDidMount() {
      this.props.actions.logout()
      return true
  },

  render() {
      return <p>You are now logged out</p>
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

let LogoutContainer = connect(null, mapDispatchToProps)(Logout)

module.exports =  LogoutContainer
