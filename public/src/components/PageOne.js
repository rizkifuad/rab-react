import React from 'react'

const PageOne = React.createClass({
  componentWillMount() {
    this.setState({
      // route components are rendered with useful information, like URL params
      userId: this.props.params.userId
    })
  },
    render: function() {
        return (<div className="barang">{this.state.userId}</div>)
    }
});

module.exports = PageOne
