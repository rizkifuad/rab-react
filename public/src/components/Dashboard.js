import React from 'react'
import { Link } from 'react-router'

const App = React.createClass({

  getInitialState() {
    return {
      loggedIn: localStorage.token
    }
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn: !!loggedIn
    })
  },

  componentWillMount() {
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }

})

export default App
