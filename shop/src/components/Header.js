import React, { useState } from 'react'
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  let [cardOpen, setCardOpen] = useState(false)
  
  return (
    <header>
        <div>
        <span className='logo'>House Staff</span>
      
        <ul className='nav'>
            <li>About us</li>
            <li>Personal cabinet</li>
            <li>Contact</li>
        </ul>
        
        <FaShoppingCart onClick={()=> setCardOpen(cardOpen = !cardOpen)}  className={`shop-card-button ${cardOpen && 'active'}`} />

        {cardOpen &&(
            <div className='shop-card'></div>
        )}
        </div>
        <div className='presentation'></div>
    </header>
  )
}
