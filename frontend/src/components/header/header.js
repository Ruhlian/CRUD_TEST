import React from 'react';
import { Link } from 'react-router-dom';  
import './header.css'; 

const Header = () => {
  return (
    <header className="header">
      {/* Link para redirigir al sitio externo */}
      <a href="https://jsonplaceholder.typicode.com/" className="inicio-link" target="_blank" rel="noopener noreferrer">
        <h1>API REST FALSA</h1>
      </a>
    </header>
  );
};

export default Header;
