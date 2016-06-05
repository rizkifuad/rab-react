import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionProjectOrder'
import { browserHistory } from 'react-router'
import TopBar from '../views/TopBar'
import moment from 'moment'
import { print } from '../utils/index'
import $ from 'jquery'
import {limit} from '../utils/index'
let ACTION = 'CREATE'



class ProjectOrderUpgrade extends React.Component {
  constructor(props) {
    super(props)
    this.handleSave = this.handleSave.bind(this)
    this.handleBarangInput = this.handleBarangInput.bind(this)
    this.handleKembali = this.handleKembali.bind(this)
    this.handleTambahOrder = this.handleTambahOrder.bind(this)
    //this.handleCetak = this.handleCetak.bind(this)
    //this.handleApprove = this.handleApprove.bind(this)
    this.firstTime = true
  }

  componentWillMount(){
    this.setState({barangInput:1,  items: [] })
    let orderId  = this.props.params.orderId ? this.props.params.orderId : null
    console.log('orderid', orderId)
    if (orderId) {
      ACTION = 'UPDATE'
      this.setState({
        orderId
      })
      this.props.actions.prepareUpgrade(ACTION, orderId)
    } else {
      this.props.actions.prepareUpgrade(ACTION)
    }

  }

  componentWillUnmount() {
    ACTION = 'CREATE'
  }

  componentDidUpdate() {
    let upgradeData = this.props.order.upgradeData
    console.log('menggila')


    $('.barang-option').addClass('is-dirty')
    if (document.getElementsByClassName('order-table').length > 0) {
      $('.order-table th label, .order-table td label').parent().remove()
      $('.order-table th label, .order-table td label').parent().remove()
      $('.order-table').attr('data-upgraded', '')
      componentHandler.upgradeElement(document.getElementsByClassName('order-table')[0],'MaterialDataTable')
    }
    componentHandler.upgradeDom();
    $('.order-table tbody tr').each(function(o, v) {
      const status = $(v).attr('data-order-status')
      if (status != '1') {
        $(v).find('input').prop('disabled', true)
      }
    })
  }


  componentDidMount() {
    const dialogCetak= document.querySelector('#dialog-cetak');
    const dialogCetakUlang = document.querySelector('#dialog-cetak-ulang');

    if (dialogCetak && ! dialogCetak.showModal) {
      dialogPolyfill.registerDialog(dialogCetak);
    }

    if (dialogCetakUlang && ! dialogCetakUlang.showModal) {
      dialogPolyfill.registerDialog(dialogCetakUlang);
    }

    dialogCetak.querySelector('.dialog-close-button')
    .addEventListener('click', function() {
      dialogCetak.close();
    });

    dialogCetakUlang.querySelector('.dialog-close-button')
    .addEventListener('click', function() {
      dialogCetakUlang.close();
    });
  }

  handleSave(e) {
    //e.preventDefault()
    //let barangs = this.refs.barangs.state.item
    //if (ACTION == 'CREATE') {
    //console.log(this.refs)
    //this.props.actions.create(this.refs, barangs)
    //} else if (ACTION == 'UPDATE') {
    //console.log(this.refs)
    //this.props.actions.update(this.refs, barangs)
    //}

  }


  handleBarangInput() {
    console.log('menggila tok')
    console.log(this.refs.barangs.state.item)
  }

  handleKembali() {
    browserHistory.push('/project_order')
  }


  handleTambahOrder(e) {
    e.preventDefault()
    const upgradeData = this.props.order.upgradeData

    const data = {
      anggaran_id: upgradeData.Anggaran.ID + "",
      barang_id: this.refs.barang.value,
      jumlah: this.refs.jumlah.value
    }
    console.log('data', data)

    this.props.actions.create(data)
  }

  handleApprove(id) {
    this.props.actions.approveOrder(id)
  }


  handleTolak(id) {
    this.props.actions.tolakOrder(id)
  }

  handleDialogCetak(id) {
    let list = []
    $('.order-table .is-selected').each(function(o, v) {
      const status = $(v).attr('data-order-status')
      const no = $(v).attr('data-no')

      list.push($(v).attr('data-id'))
    })

    console.log(list)

    this.props.order.selected = list

    let upgradeData = this.props.order.upgradeData
    if (list.length > 0) {
      //let i = confirm('Apakah anda yakin mencetak order yang sudah disetujui?')
      //if (i) {
        const dialogCetak= document.querySelector('#dialog-cetak');
        dialogCetak.showModal()
        //print('order-table')
      //}
    } else {
      alert('Tidak ada barang yang dipilih')
    }

  }
  handleDialogCetakUlang(id) {
    const dialogCetakUlang = document.querySelector('#dialog-cetak-ulang');
    dialogCetakUlang.showModal();
  }

  handleCetak()  {
    let data = {
      order: this.props.order.selected,
      supplierId: this.refs.supplier.value
    }
    this.props.actions.cetakOrder(this.props.order.upgradeData.Anggaran.ID, data, this.refs.maxCetak.value)

    const dialogCetak= document.querySelector('#dialog-cetak');
    dialogCetak.close()

  }


  handleCetakUlang(e) {
    console.log('menggila')
    const cetak = this.refs.cetak.value
    print('order-table', cetak)
    e.preventDefault()
  }

  render() {
    let upgradeData = this.props.order.upgradeData

    const title = ACTION == 'CREATE' ? 'Tambah ProjectOrder' : 'Edit ProjectOrder'
    const description = 'Edit order yang terdaftar pada aplikasi.'
    const color = ACTION == 'CREATE' ? 'brown' : 'amber'
    let barangs = this.props.order.upgradeData.Barangs
    console.log(this.props.order.upgradeData.Items)

    const auth = this.props.auth

    let TotalOrderList = null
    let i = 0
    if (upgradeData.TotalOrder && upgradeData.TotalOrder.length > 0) {
      console.log('upgradedata', upgradeData)
      TotalOrderList = upgradeData.TotalOrder.map((total_order) => {
        i++
          let color = 'none'
          if (total_order.Status == 1) {
            color = '#FFC1C1'
          }
          return (
            <tr key={i} style={{background:  color}}>
              <td>{i}</td>
              <td>{total_order.NamaBarang}</td>
              <td>{total_order.JumlahAnggaran}</td>
              <td>{total_order.JumlahOrder}</td>
              <td>{total_order.Status == 1? 'Melebihi' : ''}</td>
            </tr>
          )
      })
    }
    let TotalOrderTable = null

    if(upgradeData.TotalOrder && upgradeData.TotalOrder.length > 0) {
      TotalOrderTable =  (
        <div>
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table ">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah Anggaran</th>
                <th>Jumlah Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              { TotalOrderList }
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

    } else if(this.props.order.fetching === false){
      TotalOrderTable = (
        <h2 className="t-center">No order found</h2>
      )
    }

    let OrderList = null
    i = 0
    if (upgradeData.Order && upgradeData.Order.length > 0) {
      OrderList = upgradeData.Order.map((order) => {
        i++
          const b = barangs.find(function(bar) {
            return parseInt(bar.BarangId) == parseInt(order.BarangId)
          })
          let status = null

          console.log('if', order.ID, auth.role)
          var printClass = 'print-'+order.Cetak
          if ((order.Status == 0 || !order.Status) && auth.role == 'manager') {
            status = (
              <div>
                <button onClick={this.handleApprove.bind(this, order.ID)} type="button" className="mdl-button mdl-button-mini mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                Approve
              </button>
              &nbsp;
              <button onClick={this.handleTolak.bind(this, order.ID)} type="button" className="mdl-button mdl-button-mini mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
                Tolak
              </button>
            </div>
            )
          } else if (order.Status == 0 || !order.Status) {
            status = (<p className="t-red">Belum di Setujui</p>)
          }
          else if (order.Status == 1) {
            status = (<p className="t-green">Disetujui</p>)
            printClass += " print-row"
          } else if (order.Status == 2) {
            status = (<p className="t-blue">PO({order.Cetak})</p>)
          } else if (order.Status == 3) {
            status = (<p className="t-red">Ditolak</p>)
          }
          return (
            <tr data-no={i} data-order-status={order.Status} data-id={order.ID} key={order.ID} className={printClass}>
              <td>{i}</td>
              <td>{b.NamaBarang}</td>
              <td>{order.Jumlah}</td>
              <td>{moment(order.CreatedAt).format('YYYY-MM-DD HH:mm')}</td>
              <td className="print-hide">
                {status}
              </td>
            </tr>
          )
      })
    }
    let OrderTable = null

    if(upgradeData.Order && upgradeData.Order.length > 0) {
      OrderTable =  (
        <div>
          <table ref="mdl_table" className="order-table mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr className="print-row">
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Tanggal order</th>
                <th className="print-hide">Status</th>
              </tr>
            </thead>
            <tbody>
              { OrderList }
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

    } else if(this.props.order.fetching === false){
      OrderTable = (
        <h2 className="t-center">No order found</h2>
      )
    }
    let LeftDetail = null
    if (upgradeData.Anggaran) {
      LeftDetail = (
        <div>
          <p>Lokasi: {upgradeData.Anggaran ? upgradeData.Anggaran.Lokasi : ''}<br/>
            Blok Rumah: {upgradeData.Anggaran ? upgradeData.Anggaran.BlokRumah : ''}<br/>
            Keterangan: {upgradeData.Anggaran ? upgradeData.Anggaran.Keterangan : ''}<br/>
          </p>

          <button type="button" onClick={this.handleDialogCetak.bind(this, upgradeData.Anggaran.ID)} className="mdl-button print-hide mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
          Cetak
        </button>
        <br/>
        <br/>
        <button type="button" onClick={this.handleDialogCetakUlang.bind(this, upgradeData.Anggaran.ID)} className="mdl-button print-hide mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
        Cetak Ulang
      </button>
    </div>
      )
    }
    let CetakOption = null
    let defaultCetak = null
    let maxCetak = null
    if (upgradeData.Order && upgradeData.Order.length > 0) {
      defaultCetak = 1
      const uniqueCetak = []
      CetakOption = upgradeData.Order.map(function(ang) {
        const notUnique = uniqueCetak.find(function(i, v) {
          return i == ang.Cetak
        })


        if (notUnique == null && ang.Cetak) {
          uniqueCetak.push(ang.Cetak)
          return (
            <option key={ang.Cetak} value={ang.Cetak}>{ang.Cetak}</option>
          )
        }else {
          return null
        }

      })

      maxCetak = Math.max.apply(null, uniqueCetak)
      console.log('maxCetak', maxCetak)
    }

    let BarangOption = null
    if (this.props.order.fetching == false && this.props.order.upgradeData.Barangs) {
      BarangOption = this.props.order.upgradeData.Barangs.map(function(b) {
        console.log(b)
        return (
          <option key={b.BarangId} value={b.BarangId}>{b.NamaBarang}</option>
        )
      })
    }


    let SupplierOption = null
    let defaultSupplier = null
    if (this.props.order.fetching == false && this.props.order.upgradeData.Suppliers && this.props.order.upgradeData.Suppliers.length > 0) {
      defaultSupplier  = this.props.order.upgradeData.Suppliers[0].ID
      SupplierOption = this.props.order.upgradeData.Suppliers.map(function(b) {
        console.log(b)
        return (
          <option key={b.ID} value={b.ID}>{b.NamaSupplier}</option>
        )
      })
    }

    const defaultBarang = this.props.order.upgradeData.Barangs && this.props.order.upgradeData.Barangs.length > 0 ? this.props.order.upgradeData.Barangs[0].ID : null
    return (
      <section className="text-fields">
      <dialog id="dialog-cetak" className="mdl-dialog">
        <h3 className="mdl-dialog__title">Project Order</h3>
        <div className="mdl-dialog__content">
          <p>
            Pilih supplier
          </p>
          <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label ">
              <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label  supplier-input">
                <input type="hidden" ref="maxCetak" value={maxCetak}/>
                <select ref="supplier" className="mdl-selectfield__select" defaultValue={defaultSupplier}>
                  {SupplierOption}
                </select>
                <label className="mdl-selectfield__label" htmlhtmlFor="barang">Supplier</label>
              </div>
            </div>
          </div>

        </div>
        <div className="mdl-dialog__actions">
          <button onClick={this.handleCetak.bind(this)} type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
            Cetak
          </button>
          <button type="button" className="mdl-button dialog-close-button">Close</button>
        </div>
      </dialog>
      <dialog id="dialog-cetak-ulang" className="mdl-dialog">
        <h3 className="mdl-dialog__title">Cetak Ulang</h3>
        <div className="mdl-dialog__content">
          <p>
            Pilih nomor cetak
          </p>
          <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label ">
              <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label  supplier-input">
                <select ref="cetak" className="mdl-selectfield__select" defaultValue={defaultCetak}>
                  {CetakOption}
                </select>
                <label className="mdl-selectfield__label" htmlhtmlFor="barang">Nomor cetak</label>
              </div>
            </div>
          </div>

        </div>
        <div className="mdl-dialog__actions">
          <button onClick={this.handleCetakUlang.bind(this)} type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
            Cetak
          </button>
          <button type="button" className="mdl-button dialog-close-button">Close</button>
        </div>
      </dialog>
        <TopBar
          color={color}
          title={title}
          description={description}
        />

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
                {this.props.order.status && this.props.order.status.error  ? <div className='alert alert-info text-red'>{this.props.order.status.message}</div> : ''}
                <input ref="id" type="hidden" value={upgradeData.ProjectOrder ? upgradeData.ProjectOrder.ID : ''}/>
                <h3 className="t-center">History Order</h3>
                <div className="mdl-cell mdl-cell--12-col  mdl-cell--12-col-tablet mdl-cell--12-col-phone" id="order-table">
                  <div className="hide print-show">
                    {LeftDetail}
                  </div>
                  {OrderTable}


                </div>
                <h3 className="t-center">Total Order</h3>
                <div className="mdl-cell mdl-cell--12-col  mdl-cell--12-col-tablet mdl-cell--12-col-phone">
                  {TotalOrderTable}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={limit(this) + ' mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100 no-p-l'}>
          <div className="p-40 p-r-20 p-20--small">
            <div className=" mdl-color-text--blue-grey-400">
              <h3><i className="material-icons f-left m-r-5">format_align_left</i> Barang</h3>
              <p>Tambah order pada anggaran</p>
            </div>
          </div>
        </div>

          <div className={limit(this) + ' mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l'}>
            <div className="p-20 ml-card-holder">
              <div className="mdl-card mdl-shadow--1dp">
                <form onSubmit={this.handleTambahOrder}>
                <div className="p-30">

                  <div className="mdl-grid mdl-grid--no-spacing">
                    <div className="mdl-cell mdl-cell--6-col">
                      <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label barang-option">
                        <select ref="barang" className="mdl-selectfield__select" defaultValue={defaultBarang}>
                          {BarangOption}
                        </select>
                        <label className="mdl-selectfield__label" htmlhtmlFor="barang">Barang</label>
                        <span className="mdl-selectfield__error">Pilih barang</span>
                      </div>
                    </div>

                    <div className="mdl-cell mdl-cell--3-col">
                      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input ref="jumlah" className="mdl-textfield__input" type="text" id="sample2" />
                        <label className="mdl-textfield__label" htmlFor="sample2">Jumlah</label>
                      </div>
                    </div>

                  </div>

                  <div className="mdl-grid">
                    <div className=" m-t-20">
                      <button type="button" onClick={this.handleKembali} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
                        Kembali
                      </button>
                    </div>
                    <div className="p-l-20 m-t-20">
                      <button onClick={this.handleTambahOrder} type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                        Tambah Order
                      </button>
                    </div>
                  </div>
                </div>
        </form>
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
    order: state.order,
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const ProjectOrderUpgradeContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectOrderUpgrade)
module.exports = ProjectOrderUpgradeContainer
