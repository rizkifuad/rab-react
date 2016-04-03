import React from 'react'
import Barang from './Barang'
import Header from './Header'
import Sidebar from './Sidebar'
import { connect } from 'react-redux'
import { checkAuth } from '../actions/ActionAuth'
import { bindActionCreators } from 'redux'
import $ from 'jquery'

class App extends React.Component{
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.updateDimensions();


    this.props.checkAuth()
    componentHandler.upgradeDom()
  }

  updateDimensions() {
    const width = $(window).width()
    console.log(width)

    if (width > 1024) {
      $('.main-wrapper').removeClass('is-small-screen')
    }else {
      $('.main-wrapper').addClass('is-small-screen')
    }

  }
  componentDidMount() {
    $('.mdl-layout__drawer-button').unbind('click').bind('click',function(e){
      $('.mdl-layout__drawer').addClass('is-visible')
      $('.mdl-layout__obfuscator').addClass('is-visible')
    })

    $('.mdl-layout__obfuscator').unbind('click').bind('click',function(e){
      $('.mdl-layout__drawer').removeClass('is-visible')
      $('.mdl-layout__obfuscator').removeClass('is-visible')
    })
    this.updateDimensions()

    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  render() {
    return (
      <div className="mdl-layout__container">
        <div className="main-wrapper demo-layout mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header is-upgraded">
          <Header/>

          <Sidebar auth={this.props.auth} />

          <div className="mdl-layout__content mdl-color--grey-100 page" ng-view>
            {this.props.children ? this.props.children : <Barang/>}
          </div>
          <div className="mdl-layout__obfuscator"></div>

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
