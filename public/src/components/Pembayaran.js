import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionPembayaran'
import { getAnggarans } from '../actions/ActionAnggaran'
import { Link, browserHistory } from 'react-router'
import $ from 'jquery'
import TopBar from '../views/TopBar'
import moment from 'moment'

actionCreators.getAnggarans = getAnggarans


let firstTime = true
class Pembayaran extends React.Component {
  constructor(props) {
    super(props)
  }


  componentWillMount() {
    this.props.actions.getAnggarans()
  }


  handleEdit(id, cetak) {
    browserHistory.push(`pembayaran/edit/${id}/${cetak}`)
  }

  componentDidUpdate() {
    const _this = this
    $('table').on('change','td .mdl-checkbox__input',function(){
      var checked = []
      $('td .mdl-checkbox__input').each(function(i, k){
        this.checked && checked.push(_this.props.pembayaran.data[i])
      });
      _this.props.actions.selectPembayarans(checked)
    })

    if (this.props.anggaran && this.props.anggaran.data.length > 0 && firstTime) {
      const anggaran = this.props.anggaran.data
      console.log(anggaran)
      this.props.actions.getPembayarans(anggaran[0].ID)
      firstTime = false
      componentHandler.upgradeDom();
    } else {
      componentHandler.upgradeDom();
    }
  }

  handleAnggaranChange(e) {
    console.log(e.target.value)
    this.props.actions.getPembayarans(e.target.value)
  }

  isFetching() {
    return 'mdl-progress mdl-js-progress mdl-progress__indeterminate' + (!this.props.pembayaran.fetching ? ' hide': '')
  }

  render()  {
    let PembayaranList = null
    let i = 0
    if (this.props.pembayaran.data.length > 0) {
      PembayaranList = this.props.pembayaran.data.map((pembayaran) => {
        i++
          return (
            <tr key={pembayaran.ID}>
              <td>{i}</td>
              <td>{pembayaran.Cetak}</td>
              <td>{pembayaran.JenisBarang} Jenis</td>
              <td>{moment(pembayaran.CreatedAt).format('YYYY-MM-DD HH:mm')}</td>
              <td>
                <button onClick={this.handleEdit.bind(this, pembayaran.AnggaranId, pembayaran.Cetak)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--tiny-fab mdl-js-ripple-effect mdl-button--accent">
                  <i className="material-icons">edit</i>
                </button>
              </td>
            </tr>
          )
      })
    } 

    let PembayaranTable = null

    if(this.props.pembayaran.data.length > 0) {
      PembayaranTable =  (
        <div>
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr>
                <th className="mdl-data-table__header--sorted-ascending">No</th>
                <th>No cetak</th>
                <th>Jenis Barang</th>
                <th>Order Tanggal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { PembayaranList }
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
    } else if(this.props.pembayaran.fetching === false){
        PembayaranTable = (
          <h2 className="t-center">No data found</h2>
        )
      }

  let AnggaranOption = null
  let defaultAnggaran = null
  console.log(this.props.anggaran.fetching, this.props.anggaran.data.length)
  if (this.props.anggaran.fetching == false && this.props.anggaran.data.length > 0) {
    defaultAnggaran = this.props.anggaran.data[0]
    AnggaranOption = this.props.anggaran.data.map(function(ang) {
      console.log(ang)
      return (
        <option key={ang.ID} value={ang.ID}>{ang.Lokasi}</option>
      )
    })
  }
  console.log('option', AnggaranOption)

    const title = "Data pembayaran"
    const description = "Manajemen pembayaran aplikasi"
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

              <div className="mdl-color-text--blue-grey-400 sticky" ml-sticky offset="80" body-className="mdl-layout__content">
                <p>Klik menu dibawah untuk menambah/menghapus pembayaran</p>
                <div className="m-t-30 hide">
                  <ul className="list-bordered">
                    <li><Link to="/pembayaran/add">
                        <i className="material-icons m-r-5 f11">add</i>
                        Tambah pembayaran
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
                  <div className="mdl-grid mdl-grid--no-spacing">
                    <div className="mdl-cell mdl-cell--12-col">
                      <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                        <select className="mdl-selectfield__select" defaultValue={defaultAnggaran} onChange={this.handleAnggaranChange.bind(this)}>
                          {AnggaranOption}
                        </select>
                        <label className="mdl-selectfield__label" htmlhtmlFor="barang">Anggaran</label>
                      </div>
                    </div>
                  </div>
                </div>

                {PembayaranTable}
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
    pembayaran: state.pembayaran,
    anggaran: state.anggaran
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const PembayaranContainer = connect(mapStateToProps, mapDispatchToProps)(Pembayaran)
module.exports = PembayaranContainer
