import React, { useState, useEffect } from 'react';
import { editarProducto } from '../../services/api';
import { toast } from 'react-toastify';
import './EditProduct.css';

const EditProductModal = ({ producto, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  let lastAlertTime = null;

  // Expresión regular para validar letras, números, espacios, puntos y guiones
  const regexLetrasNumeros = /^[a-zA-Z0-9\s.-]+$/;

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
    }
  }, [producto]);

  const showAlert = (mensaje, tipo) => {
    const currentTime = Date.now();

    if (!lastAlertTime || currentTime - lastAlertTime > 5000) {
      if (tipo === 'success') {
        toast.success(mensaje);
      } else if (tipo === 'error') {
        toast.error(mensaje);
      }

      lastAlertTime = currentTime;
    }
  };

  const handleUpdateProduct = async () => {
    if (!nombre.trim() || !descripcion.trim() || !precio.toString().trim()) {
      showAlert('Todos los campos son obligatorios.', 'error');
      return;
    }

    if (!regexLetrasNumeros.test(nombre)) {
      showAlert('El nombre solo puede contener letras, números, espacios, puntos y guiones.', 'error');
      return;
    }

    if (!regexLetrasNumeros.test(descripcion)) {
      showAlert('La descripción solo puede contener letras, números, espacios, puntos y guiones.', 'error');
      return;
    }

    const precioNumero = parseFloat(precio);
    if (isNaN(precioNumero) || precioNumero <= 0) {
      showAlert('El precio debe ser un número positivo.', 'error');
      return;
    }

    const confirmUpdate = window.confirm('¿Estás seguro de que deseas guardar los cambios en este producto?');
    if (!confirmUpdate) {
      return;
    }

    try {
      const updatedProduct = { nombre, descripcion, precio: precioNumero };
      const response = await editarProducto(producto.id_producto, updatedProduct);
      showAlert('Producto actualizado con éxito.', 'success');
      onUpdate(response.producto);
      onClose();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      showAlert('Error al actualizar el producto.', 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Producto</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            pattern="^[a-zA-Z0-9\s.-]+$"
            title="El nombre solo puede contener letras, números, espacios, puntos y guiones."
          />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            pattern="^[a-zA-Z0-9\s.-]+$"
            title="La descripción solo puede contener letras, números, espacios, puntos y guiones."
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
          <button className="btn-primary" onClick={handleUpdateProduct}>Guardar Cambios</button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default EditProductModal;