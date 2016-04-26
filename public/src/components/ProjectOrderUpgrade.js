import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionProjectOrder'
import TopBar from '../views/TopBar'
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
        return (
          <option key={barang.ID} value={barang.ID}>{barang.NamaBarang}</option>

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

          <div className="mdl-cell mdl-cell--3-col">
                <button onClick={this.props.handleDelete} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--accent">
                  <i className="material-icons">delete forever</i>
                </button>
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
    this.handleTambahBarang = this.handleTambahBarang.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.firstTime = true
  }

  componentWillMount(){
    this.setState({barangInput:0,  items: [] })
    let orderId  = this.props.params.orderId ? this.props.params.orderId : null
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

    if (upgradeData.ProjectOrder) {
      this.refs.lokasi.value = upgradeData.ProjectOrder.Lokasi
      this.refs.blokRumah.value = upgradeData.ProjectOrder.BlokRumah
      this.refs.keterangan.value = upgradeData.ProjectOrder.Keterangan
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
    e.preventDefault()
    let barangs = this.refs.barangs.state.item
    if (ACTION == 'CREATE') {
      console.log(this.refs)
      this.props.actions.create(this.refs, barangs)
    } else if (ACTION == 'UPDATE') {
      console.log(this.refs)
      this.props.actions.update(this.refs, barangs)
    }

  }


  handleBarangInput() {
    console.log('menggila tok')
    console.log(this.refs.barangs.state.item)
  }

  handleTambahBarang() {
    this.setState({
      barangInput: this.state.barangInput+1
    })
  }

  handleDelete() {
    this.setState({
      barangInput: this.state.barangInput-1
    })
  }



  render() {
    let upgradeData = this.props.order.upgradeData

    const title = ACTION == 'CREATE' ? 'Tambah ProjectOrder' : 'Edit ProjectOrder'
    const description = 'Edit order yang terdaftar pada aplikasi.'
    const color = ACTION == 'CREATE' ? 'brown' : 'amber'
    let barangs = this.props.order.upgradeData.Barangs
    console.log(this.props.order.upgradeData.Items)

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
                <h3><i className="material-icons f-left m-r-5">format_align_left</i> ProjectOrder</h3>
                <p>Input data order untuk menunjang order.</p>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="p-20 ml-card-holder ml-card-holder-first">
              <div className="mdl-card mdl-shadow--1dp">
                <div className="p-30">
                  {this.props.order.status && this.props.order.status.error  ? <div className='alert alert-info text-red'>{this.props.order.status.message}</div> : ''}
                  <input ref="id" type="hidden" value={upgradeData.ProjectOrder ? upgradeData.ProjectOrder.ID : ''}/>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input ref="lokasi" className="mdl-textfield__input" type="text" id="sample2" />
                    <label className="mdl-textfield__label" htmlFor="sample2">Lokasi</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input ref="blokRumah" className="mdl-textfield__input" type="text" id="sample2" />
                    <label className="mdl-textfield__label" htmlFor="sample2">Blok Rumah</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <textarea ref="keterangan" className="mdl-textfield__input"/>
                    <label className="mdl-textfield__label" htmlFor="sample2">Keterangan</label>
                  </div>
                  <div className="m-t-20">
                    <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--3-col mdl-cell--12-col-tablet mdl-cell--12-col-phone mdl-color--grey-100 no-p-l">
            <div className="p-40 p-r-20 p-20--small">
              <div className=" mdl-color-text--blue-grey-400">
                <h3><i className="material-icons f-left m-r-5">format_align_left</i> Barang</h3>
                <p>List barang yang akan dianggarkan pada projek ini.</p>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="p-20 ml-card-holder">
              <div className="mdl-card mdl-shadow--1dp">
                <div className="p-30">

                  <BarangInput barangs={barangs} ref="barangs" count={this.state.barangInput} handleDelete={this.handleDelete} items={this.props.order.upgradeData ? this.props.order.upgradeData.Items : []}/>

                  <div className="mdl-grid">
                    <div className=" m-t-20">
                      <button type="button" onClick={this.handleTambahBarang} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect">
                        Tambah Barang
                      </button>
                    </div>
                    <div className="p-l-20 m-t-20">
                      <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                        Simpan
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
    order: state.order
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const ProjectOrderUpgradeContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectOrderUpgrade)
module.exports = ProjectOrderUpgradeContainer
