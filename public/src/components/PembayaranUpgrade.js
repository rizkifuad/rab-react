import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionPembayaran'
import TopBar from '../views/TopBar'
import moment from 'moment'
let ACTION = 'CREATE'

class PembayaranUpgrade extends React.Component {
  constructor(props) {
    super(props)
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillMount(){
    let pembayaranId  = this.props.params.pembayaranId ? this.props.params.pembayaranId : null
    if (pembayaranId) {
      let cetak = this.props.params.cetak
      ACTION = 'UPDATE'
      this.setState({
        pembayaranId
      })
      this.props.actions.prepareUpgrade(ACTION, pembayaranId, cetak)
    }

  }

  componentWillUnmount() {
    ACTION = 'CREATE'
  }

  componentDidUpdate() {
    let pembayaran = this.props.pembayaran.upgradeData

    if (pembayaran.NamaPembayaran) {
      this.refs.namaPembayaran.value = pembayaran.NamaPembayaran
      this.refs.alamat.value = pembayaran.Alamat
      componentHandler.upgradeDom();
    }



  }

  componentDidMount() {
    if (ACTION == 'CREATE') {
      componentHandler.upgradeDom();
    }

    var dialogButton = document.querySelector('.dialog-button');
    var dialog = document.querySelector('#dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('button:not([disabled])')
    .addEventListener('click', function() {
      dialog.close();
    });
  }

  handleSave(e) {
    e.preventDefault()
    if (ACTION == 'CREATE') {
      this.props.actions.create(this.refs)
    } else if (ACTION == 'UPDATE') {
      this.props.actions.update(this.refs)
    }

  }

  handleInputBayar(id) {

    var dialog = document.querySelector('#dialog');
    dialog.showModal();
  }


  render() {
    let pembayaran = this.props.pembayaran.upgradeData

    const title = ACTION == 'CREATE' ? 'Tambah Pembayaran' : 'Edit Pembayaran'
    const description = 'Edit pembayaran yang terdaftar pada aplikasi.'
    const color = ACTION == 'CREATE' ? 'brown' : 'amber'

    let PembayaranList = null
    let i = 0
    if (this.props.pembayaran.upgradeData.Detail && this.props.pembayaran.upgradeData.Detail.length > 0) {
      PembayaranList = this.props.pembayaran.upgradeData.Detail.map((pembayaran) => {
        i++
          return (
            <tr key={pembayaran.ID}>
              <td>{i}</td>
              <td>{pembayaran.NamaBarang}</td>
              <td>{pembayaran.Jumlah} {pembayaran.Satuan}</td>
              <td>
                <button onClick={this.handleInputBayar.bind(this, pembayaran.ID)} type="button" className="mdl-button mdl-button-mini mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                Input Bayar
              </button>
              </td>
            </tr>
          )
      })
    } 

    let PembayaranTable = null

    if(this.props.pembayaran.upgradeData.Detail && this.props.pembayaran.upgradeData.Detail.length > 0) {
      PembayaranTable =  (
        <div>
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr>
                <th className="mdl-data-table__header--sorted-ascending">No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
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
    let LeftDetail = null
    if (this.props.pembayaran.upgradeData.Anggaran) {
      const upgradeData = this.props.pembayaran.upgradeData
      LeftDetail = (
        <div>
        <p>Lokasi: {upgradeData.Anggaran ? upgradeData.Anggaran.Lokasi : ''}<br/>
          Blok Rumah: {upgradeData.Anggaran ? upgradeData.Anggaran.BlokRumah : ''}<br/>
          Keterangan: {upgradeData.Anggaran ? upgradeData.Anggaran.Keterangan : ''}<br/>
        </p>

      </div>
      )
    }
    return (
      <section className="text-fields">
        <TopBar
          color={color}
          title={title}
          description={description}
        />


<dialog id="dialog" className="mdl-dialog">
  <h3 className="mdl-dialog__title">Input Pembayaran</h3>
  <div className="mdl-dialog__content">
    <p>
      Input Harga dan Supplier
    </p>
  </div>
  <div className="mdl-dialog__actions">
    <button type="button" className="mdl-button">Close</button>
  </div>
</dialog>
        <div className="mdl-grid mdl-grid--no-spacing">

          <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100 no-p-l">
            <div className="p-40 p-r-20 p-20--small">
              <div className=" mdl-color-text--blue-grey-400">
                <h3><i className="material-icons f-left m-r-5">format_align_left</i> Anggaran</h3>
                {LeftDetail}
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="p-20 ml-card-holder ml-card-holder-first">
              <div className="mdl-card mdl-shadow--1dp">
                <div className="p-30">
                  {this.props.pembayaran.status && this.props.pembayaran.status.error  ? <div className='alert alert-info text-red'>{this.props.pembayaran.status.message}</div> : ''}
                  <h2 className="t-center">Order Cetak({this.props.params.cetak})</h2>
                  {PembayaranTable}
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
    pembayaran: state.pembayaran
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const PembayaranUpgradeContainer = connect(mapStateToProps, mapDispatchToProps)(PembayaranUpgrade)
module.exports = PembayaranUpgradeContainer
