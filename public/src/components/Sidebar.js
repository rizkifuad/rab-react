import React from 'react'

const Sidebar = React.createClass({


  render() {
    return (
        <div className="demo-drawer mdl-layout__drawer mdl-color-text--blue-grey-50 mdl-color--grey-900">
            <header className="mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">

                <div className="brand-logo">
                    <div className="logo">
                        <div className="foot1"></div>
                        <div className="foot2"></div>
                        <div className="foot3"></div>
                        <div className="foot4"></div>
                        <div className="foot5"></div>
                    </div>
                </div>

                <div className="clear">
                    <div className="f-left m-l-30 m-r-10">
                        <img src="img/icons/ballicons/workspace.svg" className="demo-avatar img-responsive"/>
                        </div>
                        <div className="f-left">
                            <h4 className="mdl-color-text--white m-t-5 no-m-b">Keyser Soze</h4>
                            <div className="mdl-color-text--blue-grey-400 f12"><i className=" material-icons f12">place</i> San Fransico, CA</div>
                        </div>
                    </div>
                    <div className="demo-avatar-dropdown">
                        <span>{this.props.auth.username}</span>
                        <div className="mdl-layout-spacer"></div>
                        <button id="accbtn" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                            <i className="material-icons f14">menu</i>
                        </button>
                        <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="accbtn">
                            <li className="mdl-menu__item">Elan@space.com</li>
                            <li className="mdl-menu__item">Cloud@strife.com</li>
                            <li className="mdl-menu__item">Add another account</li>
                        </ul>
                    </div>
                </header>

                <ul ml-menu close-others="false" className="demo-navigation mdl-navigation">
                    <ml-menu-item>
                        <a className="mdl-navigation__link" href="/dashboard"><i className="mdl-color-text--blue-grey-400 material-icons">dashboard</i>Dashboard</a>
                    </ml-menu-item>
                    <ml-menu-item>
                        <a className="mdl-navigation__link" href="/user"><i className="mdl-color-text--blue-grey-400 material-icons">recent_actors</i>User</a>
                    </ml-menu-item>
                    <ml-menu-item>
                        <a className="mdl-navigation__link" href="/barang"><i className="mdl-color-text--blue-grey-400 material-icons">work</i>Barang</a>
                    </ml-menu-item>
                    <ml-menu-item>
                        <a className="mdl-navigation__link" href="/rab"><i className="mdl-color-text--blue-grey-400 material-icons">format_list_numbered</i>RAB</a>
                    </ml-menu-item>
                    <ml-menu-item>
                        <a className="mdl-navigation__link" href="/report"><i className="mdl-color-text--blue-grey-400 material-icons">assessment</i>Report</a>
                    </ml-menu-item>
                    <ml-menu-item>
                        <a className="mdl-navigation__link" href="/logout"><i className="mdl-color-text--blue-grey-400 material-icons">exit_to_app</i>Logout</a>
                    </ml-menu-item>
                    

                </ul>
            </div>
            )
            }

            })

            module.exports = Sidebar
