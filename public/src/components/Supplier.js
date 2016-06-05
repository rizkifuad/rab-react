import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionSupplier'
import { Link, browserHistory } from 'react-router'
import $ from 'jquery'
import TopBar from '../views/TopBar'
import {limit} from '../utils/index'


class Supplier extends React.Component {
  constructor(props) {
    super(props)
  }


  componentWillMount() {
    this.props.actions.getSuppliers()
  }


  handleEdit(id) {
    browserHistory.push(`supplier/edit/${id}`)
  }

  componentDidUpdate() {
    const _this = this
    $('table').on('change','td .mdl-checkbox__input',function(){
      var checked = []
      $('td .mdl-checkbox__input').each(function(i, k){
        this.checked && checked.push(_this.props.supplier.data[i])
      });
      _this.props.actions.selectSuppliers(checked)
    })
    componentHandler.upgradeDom();
  }

  isFetching() {
    return 'mdl-progress mdl-js-progress mdl-progress__indeterminate' + (!this.props.supplier.fetching ? ' hide': '')
  }

  render()  {
    let SupplierList = null
    let i = 0
    if (this.props.supplier.data.length > 0) {
      SupplierList = this.props.supplier.data.map((supplier) => {
        i++
          return (
            <tr key={supplier.ID}>
              <td>{i}</td>
              <td>{supplier.NamaSupplier}</td>
              <td>{supplier.Alamat}</td>
              <td className={limit(this)}>
                <button onClick={this.handleEdit.bind(this, supplier.ID)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--tiny-fab mdl-js-ripple-effect mdl-button--accent">
                  <i className="material-icons">edit</i>
                </button>
              </td>
            </tr>
          )
      })
    } 

    let SupplierTable = null

    if(this.props.supplier.data.length > 0) {
      SupplierTable =  (
        <div>
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr>
                <th className="mdl-data-table__header--sorted-ascending">No</th>
                <th>Nama Supplier</th>
                <th>Alamat</th>
                <th className={limit(this)}>Action</th>
              </tr>
            </thead>
            <tbody>
              { SupplierList }
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
    } else if(this.props.supplier.fetching === false){
        SupplierTable = (
          <h2 className="t-center">No data found</h2>
        )
      }

    const title = "Data supplier"
    const description = "Manajemen supplier aplikasi"
    return (
      <section className="tables-data">
        <TopBar
          color="blue-grey"
          title={title}
          description={description}
        />

        <div className="mdl-grid mdl-grid--no-spacing">

          <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100">
            <div className="p-40 p-20--small">

              <div className={'mdl-color-text--blue-grey-400 sticky ' + limit(this)} ml-sticky offset="80" body-className="mdl-layout__content">
                <p>Klik menu dibawah untuk menambah/menghapus supplier</p>
                <div className="m-t-30">
                  <ul className="list-bordered">
                    <li><Link to="/supplier/add">
                        <i className="material-icons m-r-5 f11">add</i>
                        Tambah supplier
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
                {SupplierTable}
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
    supplier: state.supplier,
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const SupplierContainer = connect(mapStateToProps, mapDispatchToProps)(Supplier)
module.exports = SupplierContainer
