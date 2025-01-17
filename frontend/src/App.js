import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductoList/ProductList';
import Header from './components/header/header';  
import Footer from './components/footer/footer'; 
import { ToastContainer } from "react-toastify";
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Ruta principal de la página de inicio */}
        <Route
          path="/"
          element={
            <>
              <h1>Gestión de Inventario</h1>
              {/* Componente ProductList que ahora maneja el modal de añadir producto */}
              <ProductList />
            </>
          }
        />
      </Routes>

      <Footer />

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        closeOnClick 
        pauseOnHover 
        draggable 
      />
    </Router>
  );
};

export default App;
