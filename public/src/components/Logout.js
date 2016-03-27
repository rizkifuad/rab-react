import React from 'react'

const Logout = React.createClass({
  componentDidMount() {
      delete localStorage.token
      return true
  },

  render() {
    return <p>You are now logged out</p>
  }
})

module.exports =  Logout
