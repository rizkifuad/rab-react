import React from 'react'
import Barang from './Barang'
import Header from './Header'
import Sidebar from './Sidebar'
import { connect } from 'react-redux'
import { checkAuth } from '../actions/ActionAuth'
import { bindActionCreators } from 'redux'

class App extends React.Component{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.checkAuth()
    }

    render() {
      return (
          <div className="mdl-layout__container">
          <div className="demo-layout mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded">
          <Header/>

          <Sidebar auth={this.props.auth} />

          <div className="mdl-layout__content mdl-color--grey-100 page" ng-view>
          {this.props.children ? this.props.children : <Barang/>}
          </div>

          </div>
          </div>
      )
  }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => (
   bindActionCreators({checkAuth} , dispatch)
);

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)
module.exports = AppContainer
