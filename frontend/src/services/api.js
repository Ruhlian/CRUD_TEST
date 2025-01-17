import axios from 'axios';
import { toast } from 'react-toastify';

// La URL base del servidor Flask
const API_URL = 'http://127.0.0.1:5000/api/productos';

// Variable para controlar el intervalo de alertas
let alertaBloqueada = false;

// Función para mostrar alerta con control de tiempo
export const mostrarAlerta = (mensaje, tipo) => {
  if (alertaBloqueada) return; // No permitir mostrar otra alerta si ya está bloqueada

  // Mostrar la alerta dependiendo del tipo
  if (tipo === 'success') {
    toast.success(mensaje);
  } else if (tipo === 'error') {
    toast.error(mensaje);
  }

  // Bloquear nuevas alertas por 5 segundos
  alertaBloqueada = true;
  setTimeout(() => {
    alertaBloqueada = false; // Desbloquear después de 5 segundos
  }, 5000);
};

// Obtener todos los productos con Cache-Control
export const obtenerProductos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Cache-Control': 'no-cache', // Evitar almacenamiento en caché
      },
    });
    console.log('Productos obtenidos:', response.data);
    mostrarAlerta('Productos cargados con éxito', 'success');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    mostrarAlerta('Error al obtener productos', 'error');
    throw error;
  }
};

// Agregar un nuevo producto
export const agregarProducto = async (nombre, descripcion, precio) => {
  try {
    const response = await axios.post(API_URL, {
      nombre,
      descripcion,
      precio,
    });
    console.log('Producto agregado:', response.data);
    // Se eliminó la alerta de éxito aquí
    return response.data;
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    mostrarAlerta('Error al agregar el producto', 'error');
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (idProducto) => {
  try {
    const response = await axios.delete(`${API_URL}/${idProducto}`);
    console.log('Producto eliminado:', response.data);
    mostrarAlerta('Producto eliminado con éxito', 'success');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    mostrarAlerta('Error al eliminar el producto', 'error');
    throw error;
  }
};

// Editar un producto
export const editarProducto = async (id, updatedProduct) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
    console.log('Producto actualizado:', response.data);
    mostrarAlerta('Producto actualizado con éxito', 'success');
    return response.data;
  } catch (error) {
    console.error('Error al editar el producto:', error);
    mostrarAlerta('Error al editar el producto', 'error');
    throw error;
  }
};
