import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionUser'
import { Link, browserHistory } from 'react-router'
import $ from 'jquery'


class User extends React.Component {
  constructor(props) {
    super(props)
  }


  componentWillMount() {
    this.props.actions.getUsers()
  }


  handleEdit(id) {
    browserHistory.push(`user/edit/${id}`)
  }

  componentDidUpdate() {
    // checking the check bx
    const _this = this
    $('table').on('change','td .mdl-checkbox__input',function(){
      var checked = []
      $('td .mdl-checkbox__input').each(function(i, k){
        this.checked && checked.push(_this.props.user.data[i])
      });
      _this.props.actions.selectUsers(checked)
    })
    //var table = this.refs.mdl_table;
    //componentHandler.downgradeElements(table)
    componentHandler.upgradeDom();
  }





  isFetching() {
    return 'mdl-progress mdl-js-progress mdl-progress__indeterminate' + (!this.props.user.fetching ? ' hide': '')
  }

  render()  {
    let UserList = null
    let i = 0
    if (this.props.user.data.length > 0) {

      UserList = this.props.user.data.map((user) => {
        i++
          return (
            <tr key={user.ID}>
              <td>{i}</td>
              <td>{user.Nama}</td>
              <td>{user.Username}</td>
              <td>{user.Role}</td>
              <td>
                <button onClick={this.handleEdit.bind(this, user.ID)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--tiny-fab mdl-js-ripple-effect mdl-button--accent">
                  <i className="material-icons">edit</i>
                </button>
              </td>
            </tr>
          )
      })
    } else if(this.props.user.fetching === false){

      UserList = (
        <tr>
          <td colSpan="5">No data found</td>
        </tr>
      )
    }

    let UserTable = null

    if(this.props.user.data.length > 0) {
      UserTable =  (
        <div>
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr>
                <th className="mdl-data-table__header--sorted-ascending">No</th>
                <th>Nama Pegawai</th>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { UserList }
            </tbody>
          </table>

          <div className="hide ml-data-table-pager p-10 t-center">
            <span className="disabled previous">

              <button  className="mdl-button">«</button>
              <button  className="mdl-button">1</button>
              <button  className="mdl-button">2</button>
              <button  className="mdl-button">3</button>
              <button  className="mdl-button">4</button>
              <button  className="mdl-button">5</button>
              <button  className="mdl-button">»</button>
            </span>
          </div>
        </div>

      )

    }

    return (
      <section className="tables-data">
        <div className="mdl-color--blue-grey ml-header relative clear mdl-grid">
          <div className="mdl-cell mdl-cell--6-col p-20">
            <h3 className="mdl-color-text--white m-t-20 m-b-5">Data User</h3>
            <h4 className="mdl-color-text--blue-grey-100 m-b-20 no-m-t w100">Manajemen data user aplikasi dan role-nya</h4>

          </div>
        </div>
        <div className="mdl-grid mdl-grid--no-spacing">

          <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100">
            <div className="p-40 p-20--small">

              <div className="mdl-color-text--blue-grey-400 sticky" ml-sticky offset="80" body-className="mdl-layout__content">
                <p>Klik menu dibawah untuk menambah/menghapus user</p>
                <div className="m-t-30">
                  <ul className="list-bordered">
                    <li><Link to="/user/add">
                        <i className="material-icons m-r-5 f11">add</i>
                        Tambah user
                    </Link></li>
                    <li><a href="">
                        <i className="material-icons m-r-5 f11">delete</i>
                        Delete
                    </a></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="mdl-cell mdl-cell--9-col  mdl-cell--12-col-tablet mdl-cell--12-col-phone">
            <div className="p-20 ml-card-holder ml-card-holder-first">
              <div className="mdl-card mdl-shadow--1dp m-b-30">
                <div className="mdl-card__title">
                  <h2 className="mdl-card__title-text"></h2>
                </div>

                {UserTable}
                <div id="p2" className={this.isFetching()}></div>



              </div>
            </div>
          </div>
        </div>
      </section>

    );
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

const UserContainer = connect(mapStateToProps, mapDispatchToProps)(User)
module.exports = UserContainer
