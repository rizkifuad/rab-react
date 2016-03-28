import React from 'react'
import Barang from './Barang'
import Header from './Header'
import Sidebar from './Sidebar'
import { connect } from 'react-redux'

const Dashboard = React.createClass({
  render() {

    return (
        <div className="mdl-layout__container">
            <div className="demo-layout mdl-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
                <Header/>

                <Sidebar auth={this.props.auth} />

                <div className="mdl-layout__content mdl-color--grey-100 page" ng-view>
                    {this.props.children ? this.props.children : <Barang/>}
                </div>

            </div>
        </div>
    )
  }
})

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}


const DashboardContainer = connect(mapStateToProps)(Dashboard)
module.exports = DashboardContainer
