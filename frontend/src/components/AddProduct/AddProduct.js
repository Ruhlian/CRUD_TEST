import React, { useState, useRef } from 'react';
import { agregarProducto } from '../../services/api';
import { toast } from 'react-toastify';
import './AddProduct.css';

const AddProductModal = ({ onClose, onAddProduct }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  
  // Referencia para almacenar el tiempo de la última alerta
  const lastAlertTime = useRef(null);

  // Expresión regular para validar letras, números, espacios, ".", "," y "-"
  const regexLetrasNumerosSimbolos = /^[a-zA-Z0-9\s.,-]+$/;

  // Función generalizada para mostrar alertas con límite de tiempo
  const showAlert = (mensaje, tipo) => {
    const currentTime = Date.now();

    // Si han pasado más de 5 segundos desde la última alerta, se muestra
    if (!lastAlertTime.current || currentTime - lastAlertTime.current > 5000) {
      if (tipo === 'success') {
        toast.success(mensaje);
      } else if (tipo === 'error') {
        toast.error(mensaje);
      }

      // Actualiza el tiempo de la última alerta
      lastAlertTime.current = currentTime;
    }
  };

  const handleAddProduct = async () => {
    // Validaciones
    if (!nombre.trim() || !descripcion.trim() || !precio.trim()) {
      showAlert('Todos los campos son obligatorios.', 'error');
      return;
    }

    if (!regexLetrasNumerosSimbolos.test(nombre)) {
      showAlert('El nombre solo puede contener letras, números, espacios, ".", "," y "-".', 'error');
      return;
    }

    if (!regexLetrasNumerosSimbolos.test(descripcion)) {
      showAlert('La descripción solo puede contener letras, números, espacios, ".", "," y "-".', 'error');
      return;
    }

    const precioNumero = parseFloat(precio);
    if (precioNumero <= 0 || isNaN(precioNumero)) {
      showAlert('El precio debe ser un número positivo.', 'error');
      return;
    }

    // Confirmación antes de agregar
    const confirmAdd = window.confirm('¿Estás seguro de que deseas agregar este producto?');
    if (!confirmAdd) {
      return; // Si no confirma, no hace nada
    }

    try {
      const nuevoProducto = await agregarProducto(nombre, descripcion, precioNumero);
      showAlert('Producto agregado con éxito.', 'success');
      onAddProduct(nuevoProducto);
      onClose();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      showAlert('Error al agregar el producto.', 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Producto</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            pattern="^[a-zA-Z0-9\s.,-]+$"
            title="El nombre solo puede contener letras, números, espacios, '.', ',' y '-'."
          />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            pattern="^[a-zA-Z0-9\s.,-]+$"
            title="La descripción solo puede contener letras, números, espacios, '.', ',' y '-'."
          />
        </div>
        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0.01"
            step="0.01"
            title="El precio debe ser un número positivo."
          />
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={handleAddProduct}>Agregar</button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AddProductModal;
