import React, { Component } from 'react'

export class Order extends Component {
  render() {
    return (
      <div className='item'>
        <img src={"./img/"+this.props.item.img} alt='pic'/>
                <h3>{this.props.item.title}</h3>
                <b>{this.props.item.price}$</b>
      </div>
    )
  }
}

export default Order