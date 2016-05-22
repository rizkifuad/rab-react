import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionProjectOrder'
import { browserHistory } from 'react-router'
import TopBar from '../views/TopBar'
import moment from 'moment'
import { print } from '../utils/index'
import $ from 'jquery'
let ACTION = 'CREATE'


class BarangInput extends React.Component {
  constructor(props) {
    super(props)
    this.firstTime = true
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount() {
    let item = {}

    this.setState({ item })
  }


  handleChange() {
    let item = {}
    item.barang = []
    item.jumlah = []
    for (var i = 0; i < this.props.count ; i++) {
      item.barang[i] =  this.refs['barang' + i].value
      item.jumlah[i] =  this.refs['jumlah' + i].value
    }

    this.setState({item})
    console.log(item)
  }

  componentDidUpdate() {
    const items = this.props.items
    if (this.firstTime && items) {
      let item = {}
      item.barang = []
      item.jumlah = []
      for (var i = 0; i < items.length ; i++) {
        const detail = items[i]
        if (detail.BarangId) {
          item.barang[i]= detail.BarangId
        } 
        if (detail.Jumlah) {
          item.jumlah[i]= detail.Jumlah
        }
      }
      console.log('item', item)
      this.setState({item})
      this.firstTime = false
    }
  }


  render() {
    let count = this.props.count
    let Inputs = []

    let BarangList;

    if (this.props.barangs) {
      BarangList = this.props.barangs.map((barang) => {
        console.log('barangas', barang)
        return (
          <option key={barang.BarangId} value={barang.BarangId}>{barang.NamaBarang}</option>

        )
      })
    }
    

    for (var id = 0; id < count; id++) {
      let jumlah = 0
      let barang = 1
      if (this.state.item && this.state.item.jumlah) {
       jumlah = this.state.item.jumlah[id] ? this.state.item.jumlah[id] : 0
       barang = this.state.item.barang[id] ? this.state.item.barang[id] : 1
      }
      Inputs.push(
        <div className="mdl-grid mdl-grid--no-spacing" key={id}>
          <div className="mdl-cell mdl-cell--6-col">
            <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
              <select ref={'barang' + id} className="mdl-selectfield__select" defaultValue={barang}>
                {BarangList}
              </select>
              <label className="mdl-selectfield__label" htmlhtmlFor="barang">Barang</label>
              <span className="mdl-selectfield__error">Pilih barang</span>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--3-col">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input ref={'jumlah' + id} className="mdl-textfield__input" type="text" id="sample2" onChange={this.handleChange} value={jumlah} />
              <label className="mdl-textfield__label" htmlFor="sample2">Jumlah</label>
            </div>
          </div>

        </div>
      )
    }

    return (
      <div>
        { Inputs }
      </div>
    )
  }

}

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
    if (this.firstTime && upgradeData.Items) {
      this.setState({barangInput: upgradeData.Items.length})
      this.firstTime = false
    }

    if (upgradeData.Anggaran) {
      //this.refs.lokasi.value = upgradeData.ProjectOrder.Lokasi
      //this.refs.blokRumah.value = upgradeData.ProjectOrder.BlokRumah
      //this.refs.keterangan.value = upgradeData.ProjectOrder.Keterangan
      componentHandler.upgradeDom();
    }

    if (ACTION == 'CREATE') {
      componentHandler.upgradeDom();
    }
  }


  componentDidMount() {
    if (ACTION == 'CREATE') {
      componentHandler.upgradeDom();
    }
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
    console.log('barang', this.refs.barangs.state.item)
    const upgradeData = this.props.order.upgradeData
    const addData = this.refs.barangs.state.item
    console.log('upgradata', upgradeData)

    const data = {
      anggaran_id: upgradeData.Anggaran.ID + "",
      barang_id: addData.barang[0],
      jumlah: addData.jumlah[0]
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

  handleCetak(id) {
    let upgradeData = this.props.order.upgradeData
    var approved = upgradeData.Order.filter(function(e) {
      return e.Status == '1'
    })
    if (approved.length > 0) {
      let i = confirm('Apakah anda yakin mencetak order yang sudah disetujui?')
      if (i) {
        this.props.actions.cetakOrder(id)
        print('order-table')
      }
    } else {
      alert('Tidak ada barang yang pending')
    }
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
      const b= barangs.find(function(bar) {
        return parseInt(bar.BarangId) == parseInt(order.BarangId)
      })
      let status = null

      console.log('if', order.ID, auth.role)
      var printClass = ""
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
        printClass = "print-row"
      } else if (order.Status == 2) {
        status = (<p className="t-blue">Dicetak({order.Cetak})</p>)
      } else if (order.Status == 3) {
        status = (<p className="t-red">Ditolak</p>)
      }
      return (
        <tr key={order.ID} className={printClass}>
          <td>{i}</td>
          <td>{b.NamaBarang}</td>
          <td>{order.Jumlah}</td>
          <td>{moment(order.CreatedAt).format('YYYY-MM-DD HH:mm')}</td>
          <td>
            {status}
          </td>
        </tr>
      )
      })
    }
    let OrderTable = null

    if(upgradeData.Order && upgradeData.Order.length > 0) {
      OrderTable =  (
        <div id="order-table">
          <table ref="mdl_table" className="mdl-data-table ml-table-striped mdl-js-data-table ">
            <colgroup>
              <col className="auto-cell-size p-r-20"/>
            </colgroup>
            <thead>
              <tr className="print-row">
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Tanggal order</th>
                <th>Status</th>
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

        <button type="button" onClick={this.handleCetak.bind(this, upgradeData.Anggaran.ID)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
          Cetak
        </button>
      </div>
      )
    }
    return (

      <form onSubmit={this.handleSave}>
        <section className="text-fields">
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
                  <div className="mdl-cell mdl-cell--12-col  mdl-cell--12-col-tablet mdl-cell--12-col-phone">
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

          <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100 no-p-l">
            <div className="p-40 p-r-20 p-20--small">
              <div className=" mdl-color-text--blue-grey-400">
                <h3><i className="material-icons f-left m-r-5">format_align_left</i> Barang</h3>
                <p>Tambah order pada anggaran</p>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="p-20 ml-card-holder">
              <div className="mdl-card mdl-shadow--1dp">
                <div className="p-30">

                  <BarangInput barangs={barangs} ref="barangs" count={this.state.barangInput}  />

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
              </div>
            </div>
          </div>

        </div>  

      </section>
    </form>
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
