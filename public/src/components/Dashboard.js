import React from 'react'
import auth from '../utils/auth'
import Barang from '../components/Barang'

const Dashboard = React.createClass({
  render() {
    const token = auth.getToken()

    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <p>{token}</p>
        {this.props.children ? this.props.children : <Barang/>}
      </div>
    )
  }
})

module.exports = Dashboard
