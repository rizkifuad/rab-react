import React from 'react'
import * as actionCreators from '../actions/ActionAuth'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'

class Logout extends React.Component{
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.actions.logout()
    }

    render() {
        return <p>You are now logged out</p>
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions : bindActionCreators(actionCreators, dispatch)
});

let LogoutContainer = connect(null, mapDispatchToProps)(Logout)

module.exports =  LogoutContainer
