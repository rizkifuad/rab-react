import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions'
require('../../assets/css/login.css')

const Login = React.createClass({
    onLoginSubmit(e) {
        e.preventDefault()
        this.props.actions.authenticate({ 
            username: this.refs.username.value,
            password: this.refs.password.value,
            next: this.props.state ? this.props.state.nextPathname : null
        })
    },
    render: function() {
        console.log(this.props)
        return (
            <div className="mdl-layout__container">
            {this.props.auth.statusText ? <div className='alert alert-info'>{this.props.auth.statusText} {this.props.username}</div> : ''}
                <div className="demo-layout mdl-layout mdl-layout--fixed-header mdl-js-layout mdl-color--grey-100">
                    <div className="demo-ribbon mdl-color--accent"></div>
                    <main className="demo-main mdl-layout__content">
                        <h2 className="t-center mdl-color-text--white text-shadow">Rencana Anggaran Belanja</h2>
                        <a id="top"></a>
                        <div className="demo-container mdl-grid">
                            <div className="mdl-cell mdl-cell--4-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
                            <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet">

                                <div className="mdl-card__title">
                                    <h2 className="mdl-card__title-text">
                                        <i className="material-icons mdl-color-text--grey m-r-5 lh-13">account_circle</i>
                                        Login
                                    </h2>
                                </div>
                                <div className="p-l-20 p-r-20 p-b-20">
                                    <form onSubmit={this.onLoginSubmit}>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
                                            <input ref="username" className="mdl-textfield__input" type="text" id="sample3" />
                                            <label className="mdl-textfield__label" htmlFor="sample3">Username</label>
                                        </div>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
                                            <input ref="password" className="mdl-textfield__input" type="password" id="sample3" />
                                            <label className="mdl-textfield__label" htmlFor="sample3">Password</label>
                                        </div>

                                        <div className="m-t-20">
                                            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl-color--light-blue">
                                                Login
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
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

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)

