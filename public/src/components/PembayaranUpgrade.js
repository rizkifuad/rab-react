import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionPembayaran'
import TopBar from '../views/TopBar'
import moment from 'moment'
import $ from 'jquery'
import {toRp} from '../utils/index'
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
      componentHandler.upgradeDom();

    var dialogButton = document.querySelector('.dialog-button');
    var dialog = document.querySelector('#dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.dialog-close-button')
    .addEventListener('click', function() {
      dialog.close();
    });
  }

  handleSave(e) {
    e.preventDefault()
    if (ACTION == 'CREATE') {
      this.props.actions.update(this.refs)
    } else if (ACTION == 'UPDATE') {
      this.props.actions.update(this.refs)
    }
    var dialog = document.querySelector('#dialog');
    dialog.close()

  }

  handleUpdateTotal(e) {
    var harga = e.target.value
    var jumlah = this.refs.jumlah.value
    this.refs.total.value = harga * jumlah
    var faketotal = toRp(harga* jumlah)
    this.refs.faketotal.value = faketotal
  }

  handleInputBayar(id) {
    var order = this.props.pembayaran.upgradeData.Detail.find(function(d) {
      return d.ID == id
    })

    var dialog = document.querySelector('#dialog');
    dialog.showModal();
    const defaultAnggaran = this.props.pembayaran.upgradeData.Supplier ? this.props.pembayaran.upgradeData.Supplier[0].ID : null
    this.refs.jumlah.value = order.Jumlah
    this.refs.total.value = 0
    this.refs.faketotal.value = 0
    this.refs.harga.value = ''
    this.refs.supplier.value = defaultAnggaran
    this.refs.id.value = order.ID
    this.refs.anggaran_id.value = order.AnggaranId
    this.refs.cetak.value = order.Cetak
    $('.supplier-input').addClass('is-dirty')
    $('.jumlah-input').addClass('is-dirty')
    $('.harga-input').addClass('is-dirty')
  }

  handleLunasi(id) {
    var order = this.props.pembayaran.upgradeData.Detail.find(function(d) {
      return d.ID == id
    })
    console.log('oder', order)
    this.props.actions.update({}, {
      jumlah: order.Jumlah+'',
      total: order.Total+'',
      status: 2+'',
      harga: order.Harga+'',
      id: order.ID+'',
      anggaran_id: order.AnggaranId,
      cetak: order.Cetak
    })
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
          let status = null
          if (pembayaran.Status == 0 || !pembayaran.Status) {
            status = (
              <div>
                <button onClick={this.handleInputBayar.bind(this, pembayaran.ID)} type="button" className="mdl-button mdl-button-mini mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                Input Bayar
              </button>
            </div>
            )
          }
          else if (pembayaran.Status == 1) {
            status = (
              <div>
                <button onClick={this.handleLunasi.bind(this, pembayaran.ID)} type="button" className="mdl-button mdl-button-mini mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
                Lunasi
              </button>
            </div>
            )
          } else if (pembayaran.Status == 2) {
            status = (<p className="t-green">Lunas</p>)
          } else if (pembayaran.Status == 3) {
            status = (<p className="t-red">Ditolak</p>)
          }

          let supplier = null

          if (this.props.pembayaran.upgradeData.Supplier) {
            const getSupplier = this.props.pembayaran.upgradeData.Supplier.find(function(s) {
              console.log(s.ID, pembayaran.SupplierId)
              return s.ID == pembayaran.SupplierId
            })

            supplier = getSupplier == null ? '-' : getSupplier.NamaSupplier
          }

          return (
            <tr key={pembayaran.ID}>
              <td>{i}</td>
              <td>{pembayaran.NamaBarang}</td>
              <td>{pembayaran.Jumlah} {pembayaran.Satuan}</td>
              <td>{toRp(pembayaran.Harga)}</td>
              <td>{toRp(pembayaran.Jumlah * pembayaran.Total)}</td>
              <td>{supplier}</td>
              <td>{status}</td>
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
              <col className="auto-cell-size p-r-10"/>
            </colgroup>
            <thead>
              <tr>
                <th className="mdl-data-table__header--sorted-ascending">No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Total</th>
                <th>Supplier</th>
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
  let SupplierOption = null
  if (this.props.pembayaran.fetching == false && this.props.pembayaran.upgradeData.Supplier) {
    SupplierOption = this.props.pembayaran.upgradeData.Supplier.map(function(ang) {
      console.log(ang)
      return (
        <option key={ang.ID} value={ang.ID}>{ang.NamaSupplier}</option>
      )
    })
  }
  const defaultAnggaran = this.props.pembayaran.upgradeData.Supplier ? this.props.pembayaran.upgradeData.Supplier[0].ID : null
    return (
      <section className="text-fields">
        <TopBar
          color={color}
          title={title}
          description={description}
          data={LeftDetail}
        />


      <dialog id="dialog" className="mdl-dialog">
        <form onSubmit={this.handleSave}>
          <h3 className="mdl-dialog__title">Input Pembayaran</h3>
          <div className="mdl-dialog__content">
            <p>
              Input Harga dan Supplier
            </p>
            <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
              <input ref="id" type="hidden" />
              <input ref="status" type="hidden" value="1" />
              <input ref="anggaran_id" type="hidden" />
              <input ref="cetak" type="hidden" />
              <input ref="jumlah" type="hidden" />
              <input ref="total" type="hidden" />
              <div className="hide mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label  supplier-input">
                  <select ref="supplier" className="mdl-selectfield__select" defaultValue={defaultAnggaran}>
                    {SupplierOption}
                  </select>
                  <label className="mdl-selectfield__label" htmlhtmlFor="barang">Supplier</label>
                </div>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input ref="harga" className="mdl-textfield__input" type="text" id="sample2" onChange={this.handleUpdateTotal.bind(this)} />
                <label className="mdl-textfield__label" htmlhtmlFor="sample2">Harga per satuan</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label jumlah-input">
                <input ref="jumlah" className="mdl-textfield__input" type="text" id="jumlah" disabled/>
                <label className="mdl-textfield__label" htmlhtmlFor="jumlah">Jumlah Barang</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label harga-input">
                <input ref="faketotal" className="mdl-textfield__input" type="text" id="total" disabled/>
                <label className="mdl-textfield__label" htmlhtmlFor="total">Total Harga</label>
              </div>
            </div>

          </div>
          <div className="mdl-dialog__actions">
            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
              Simpan
            </button>
            <button type="button" className="mdl-button dialog-close-button">Close</button>
          </div>
        </form>
      </dialog>

      <br/>
      <br/>
      <br/>
      <div className="mdl-grid mdl-grid--no-spacing">

          <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="p-20 ml-card-holder ml-card-holder-first">
              <div className="mdl-card mdl-shadow--1dp">
                <div className="p-30">
                  {this.props.pembayaran.status && this.props.pembayaran.status.error  ? <div className='alert alert-info text-red'>{this.props.pembayaran.status.message}</div> : ''}
                  <h2 className="t-center">PO ({this.props.params.cetak})</h2>
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
