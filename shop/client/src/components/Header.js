import React, { useState } from 'react'
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Order from './Order';

export default function Header(props) {
  let [cardOpen, setCardOpen] = useState(false)
  
  return (
    <header>
        <div>
        <span className='logo'>Home Market</span>
      
        <ul className='nav'>
            <li><FaShoppingCart onClick={()=> setCardOpen(cardOpen = !cardOpen)}  className={`shop-card-button ${cardOpen && 'active'}`} /></li>
            <li><FaUserCircle /></li>
            <li>About us</li>
            <li>Contact</li>
            
        </ul>
      

        {cardOpen &&(
            <div className='shop-card'>
              {props.orders.map(el => (
                <Order key={el.id} item={el}/>
        ))}
            </div>
        )}
        </div>
        <div className='presentation'></div>
    </header>
  )
}
