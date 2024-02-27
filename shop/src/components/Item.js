/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';


class Item extends Component {

    render() {
        return (
            <div className='item'>
                <img src={"./img/"+this.props.item.img} alt='pic'/>
                <h3>{this.props.item.title}</h3>
                <p>{this.props.item.desc}</p>
                <b>{this.props.item.price}$</b>
                <div className='add-to-card'>+</div>
            </div>
        );
    }
}


export default Item;