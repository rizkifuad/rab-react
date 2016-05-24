import  React  from 'react'

const TopBar = React.createClass({

  handleBgColor() {
    const color = this.props.color
    return `ml-header relative clear mdl-color--${color}`
  },
  handleTextColor() {
    const color = this.props.color
    return `m-b-20 no-m-t w100 mdl-color-text--${color}-100`
  },
  render() {
    return (
      <div className={this.handleBgColor()}>
        <div className="p-20">
          <h3 className="mdl-color-text--white m-t-20 m-b-5">{this.props.title}</h3>
          <h4 className={this.handleTextColor()}>{this.props.description}</h4>
          <h4 className="mdl-color-text--white m-t-20 m-b-5">{this.props.data}</h4>
        </div>
      </div>
    )
  }
})

export default TopBar
