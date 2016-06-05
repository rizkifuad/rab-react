import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionAnggaran'
import { Link, browserHistory } from 'react-router'
import $ from 'jquery'
import TopBar from '../views/TopBar'
import {limit} from '../utils/index'


class Anggaran extends React.Component {
  constructor(props) {
    super(props)
  }


  componentWillMount() {
    this.props.actions.getAnggarans()
  }


  handleEdit(id) {
    browserHistory.push(`anggaran/edit/${id}`)
  }

  componentDidUpdate() {
    const _this = this
    $('table').on('change','td .mdl-checkbox__input',function(){
      var checked = []
      $('td .mdl-checkbox__input').each(function(i, k){
        this.checked && checked.push(_this.props.anggaran.data[i])
      });
      _this.props.actions.selectAnggarans(checked)
    })
    componentHandler.upgradeDom();
  }

  isFetching() {
    console.log(this.props.anggaran.fetching)
    return 'mdl-progress mdl-js-progress mdl-progress__indeterminate' + (!this.props.anggaran.fetching ? ' hide': '')
  }

  render()  {
    let AnggaranList = null
    let i = 0
    if (this.props.anggaran.data.length > 0) {
      AnggaranList = this.props.anggaran.data.map((anggaran) => {
        i++
          return (
            <tr key={anggaran.ID}>
              <td>{i}</td>
              <td>{anggaran.Lokasi}</td>
              <td>{anggaran.BlokRumah}</td>
              <td>{anggaran.Keterangan}</td>
              <td className={limit(this)}>
                <button onClick={this.handleEdit.bind(this, anggaran.ID)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--tiny-fab mdl-js-ripple-effect mdl-button--accent">
                  <i className="material-icons">edit</i>
                </button>
              </td>
            </tr>
          )
      })
    }

    let AnggaranTable = null

    if(this.props.anggaran.data.length > 0) {
      AnggaranTable =  (
        <div>
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr>
                <th className="mdl-data-table__header--sorted-ascending">No</th>
                <th>Lokasi</th>
                <th>Blok Rumah</th>
                <th>Keterangan</th>
                <th className={limit(this)}>Action</th>
              </tr>
            </thead>
            <tbody>
              { AnggaranList }
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

    } else if(this.props.anggaran.fetching === false){
      AnggaranTable = (
        <h2 className="t-center">No data found</h2>
      )
    }

    const title = "Data anggaran"
    const description = "Manajemen anggaran aplikasi"
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
                <p>Klik menu dibawah untuk menambah/menghapus anggaran</p>
                <div className="m-t-30">
                  <ul className="list-bordered">
                    <li><Link to="/anggaran/add">
                        <i className="material-icons m-r-5 f11">add</i>
                        Tambah anggaran
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
                {AnggaranTable}
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
    anggaran: state.anggaran,
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const AnggaranContainer = connect(mapStateToProps, mapDispatchToProps)(Anggaran)
module.exports = AnggaranContainer
