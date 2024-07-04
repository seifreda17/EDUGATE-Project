import React from "react";
import "./footer.css";
import { Link } from 'react-router-dom';


const Footer = () => {
  const pages = [
    { title: "Home Page", path: "/" },
    { title: "About Page", path: "/about" },
    { title: "Top Schools Page", path: "/Pricing" },
    { title: "Schools Page", path: "/blog" },
    { title: "Contact Page", path: "/contact" },
  ];
  return (
    <>
      <section className="footerContact">
  <div className="container">
    <div className="send flex">
      <div className="text">
        <h1> Do You Have Questions ? </h1>
        <p> We'll help you to grow your career and growth.</p>
      </div>
      <button 
        className="btn5" 
        onClick={() => window.location.href = '/contact'}>
        Contact Us Today
      </button>
    </div>
  </div>
</section>

      <footer>
        <div className="container">
          <div className="box">
            <div className="logo">
              <img src="../images/logo-light.png" alt="" />
              <h2>
                it 's is a platform designed to make the school search process
                simpler and more efficient for parents like you to easily
                explore and compare a comprehensive range of educational
                institutions.
              </h2>
              <p> Do you need any help ? </p>
              <div className="input flex">
                <input type="text" placeholder="Email Address" />
                <button> Subscribe </button>
              </div>
            </div>
          </div>
          
      <ul>
      <h2>LAYOUTS</h2>
        {pages.map((page, index) => (
          <li key={index}>
            <Link to={page.path}>{page.title}</Link>
          </li>
        ))}
      </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;