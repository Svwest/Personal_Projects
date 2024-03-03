import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LiaWaze } from "react-icons/lia";
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";


export default function Footer() {
  return (
    <footer>
      <div className="social-media"> 
        <AiOutlineFacebook className="social-icon" />
        <AiOutlineInstagram className="social-icon" />
        <FaWhatsapp className="social-icon" />
        <LiaWaze className="social-icon" />
        
      </div>
    </footer>
  );
}
