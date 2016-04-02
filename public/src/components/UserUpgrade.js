import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionUser'
let ACTION = 'CREATE'

class UserUpgrade extends React.Component {
  constructor(props) {
    super(props)
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillMount(){
    let userId  = this.props.params.userId ? this.props.params.userId : null
    if (userId) {
      ACTION = 'UPDATE'
    }
    this.setState({
      userId
    })

    this.props.actions.prepareUpgrade(ACTION, userId)
  }

  componentDidUpdate() {
    let user = this.props.user.upgradeData.User

    if (user) {
      this.refs.nama.value = user.Nama
      this.refs.username.value = user.Username
      this.refs.role.value = user.Role
      componentHandler.upgradeDom();
    }


  }

  handleSave(e) {
    e.preventDefault()
    if (ACTION == 'CREATE') {
      
    } else if (ACTION == 'UPDATE') {
      this.props.actions.update(this.refs)
    }

  }

  

  render() {
    let user = this.props.user.upgradeData.User
    let roles = this.props.user.upgradeData.Role


    let roleSelect = null
    if (roles) {
      roleSelect = roles.map((role) => {
        let selected = false
        if (user && role == user.Role) {
          selected = true;
        }
        return (
          <option value={role} key={role}>
            {role}
          </option>
        )
      })
    }


  return (

<section className="text-fields">
  <div className="mdl-color--amber ml-header relative clear">
    <div className="p-20">
      <h3 className="mdl-color-text--white m-t-20 m-b-5">{ACTION} User</h3>
      <h4 className="mdl-color-text--amber-100 m-b-20 no-m-t w100">Edit user yang terdaftar pada aplikasi.</h4>
    </div>
  </div>

  <div className="mdl-grid mdl-grid--no-spacing">

    <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100 no-p-l">
      <div className="p-40 p-r-20 p-20--small">
        <div className=" mdl-color-text--blue-grey-400">
          <h3><i className="material-icons f-left m-r-5">format_align_left</i> Bantuan</h3>
          <p>Input data user untuk menunjang akses user aplikasi dan manajemen laporan.</p>
        </div>
      </div>
    </div>

    <div className="mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
      <div className="p-20 ml-card-holder">
        <div className="mdl-card mdl-shadow--1dp">
          <div className="p-30">
            {this.props.user.error  ? <div className='alert alert-info text-red'>{this.props.user.error}</div> : ''}
            <form onSubmit={this.handleSave}>
              <input ref="id" type="hidden" value={user ? user.ID : ''}/>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input ref="nama" className="mdl-textfield__input" type="text" id="sample2" />
                <label className="mdl-textfield__label" htmlhtmlFor="sample2">Nama</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input ref="username" className="mdl-textfield__input" type="text" id="sample2" />
                <label className="mdl-textfield__label" htmlhtmlFor="sample2">Username</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input ref="password" className="mdl-textfield__input" type="password" id="sample2" />
                <label className="mdl-textfield__label" htmlhtmlFor="sample2">Password</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input ref="confirmPassword" className="mdl-textfield__input" type="password" id="sample2" />
                <label className="mdl-textfield__label" htmlhtmlFor="sample2">Confirm Password</label>
              </div>
              <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                <select ref="role" className="mdl-selectfield__select" defaultValue={user ? user.Role : ''}>
                  {roleSelect}
                </select>
                <label className="mdl-selectfield__label" htmlhtmlhtmlFor="gender">Role</label>
                <span className="mdl-selectfield__error">Pilih role user</span>
              </div>
              <div className="m-t-20">
                <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>  
</section>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const UserUpgradeContainer = connect(mapStateToProps, mapDispatchToProps)(UserUpgrade)
module.exports = UserUpgradeContainer
