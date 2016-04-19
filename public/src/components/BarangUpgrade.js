import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/ActionBarang'
import TopBar from '../views/TopBar'
let ACTION = 'CREATE'

class BarangUpgrade extends React.Component {
  constructor(props) {
    super(props)
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillMount(){
    let barangId  = this.props.params.barangId ? this.props.params.barangId : null
    if (barangId) {
      ACTION = 'UPDATE'
      this.setState({
        barangId
      })
      this.props.actions.prepareUpgrade(ACTION, barangId)
    }

  }

  componentWillUnmount() {
    ACTION = 'CREATE'
  }

  componentDidUpdate() {
    let barang = this.props.barang.upgradeData

    if (barang.NamaBarang) {
      this.refs.namaBarang.value = barang.NamaBarang
      this.refs.satuan.value = barang.Satuan
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
    if (ACTION == 'CREATE') {
      this.props.actions.create(this.refs)
    } else if (ACTION == 'UPDATE') {
      this.props.actions.update(this.refs)
    }

  }



  render() {
    let barang = this.props.barang.upgradeData

    const title = ACTION == 'CREATE' ? 'Tambah Barang' : 'Edit Barang'
    const description = 'Edit barang yang terdaftar pada aplikasi.'
    const color = ACTION == 'CREATE' ? 'brown' : 'amber'
    return (

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
                <h3><i className="material-icons f-left m-r-5">format_align_left</i> Bantuan</h3>
                <p>Input data barang untuk menunjang ref.</p>
              </div>
            </div>
          </div>

          <div className="mdl-cell mdl-cell--9-col mdl-cell--12-col-tablet mdl-cell--12-col-phone no-p-l">
            <div className="p-20 ml-card-holder ml-card-holder-first">
              <div className="mdl-card mdl-shadow--1dp">
                <div className="p-30">
                  {this.props.barang.status && this.props.barang.status.error  ? <div className='alert alert-info text-red'>{this.props.barang.status.message}</div> : ''}
                  <form onSubmit={this.handleSave}>
                    <input ref="id" type="hidden" value={barang ? barang.ID : ''}/>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                      <input ref="namaBarang" className="mdl-textfield__input" type="text" id="sample2" />
                      <label className="mdl-textfield__label" htmlhtmlFor="sample2">Nama Barang</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                      <input ref="satuan" className="mdl-textfield__input" type="text" id="sample2" />
                      <label className="mdl-textfield__label" htmlhtmlFor="sample2">Satuan</label>
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
    barang: state.barang
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const BarangUpgradeContainer = connect(mapStateToProps, mapDispatchToProps)(BarangUpgrade)
module.exports = BarangUpgradeContainer
