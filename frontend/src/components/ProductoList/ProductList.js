import React, { useState, useEffect } from 'react';
import { obtenerProductos, eliminarProducto } from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import EditProduct from '../EditProduct/EditProduct';
import Modal from '../modals/modals';
import AddProduct from '../AddProduct/AddProduct';
import { mostrarAlerta } from '../../services/api';
import './ProductList.css';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false); // Solo un modal de añadir
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal de edición
  const [criterioOrden, setCriterioOrden] = useState('nombre');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [buscar, setBuscar] = useState('');
  const productosPorPagina = 10;

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await obtenerProductos();
      setProductos(data);
    };
    fetchProductos();
  }, []);

  const handleAddProduct = (nuevoProducto) => {
    setProductos([...productos, nuevoProducto]);
    setAddModalOpen(false); // Cierra el modal de añadir
    setPaginaActual(1);
  };

  const handleEdit = (producto) => {
    setProductoSeleccionado(producto);
    console.log('Abriendo el modal de edición para el producto:', producto); // Log cuando se abre el modal de edición
    setEditModalOpen(true); // Abre el modal de edición
    setAddModalOpen(false); // Asegura que el modal de añadir no esté abierto
  };

  const handleDelete = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    
    if (confirmacion) {
      try {
        await eliminarProducto(id);
        const productosActualizados = productos.filter((producto) => producto.id_producto !== id);
        setProductos(productosActualizados);
        mostrarAlerta('Producto eliminado con éxito', 'success');  // Alerta después de la eliminación
      } catch (error) {
        console.error('No se pudo eliminar el producto', error);
        mostrarAlerta('Error al eliminar el producto', 'error');  // Alerta en caso de error
      }
    } else {
      console.log('Eliminación cancelada');
    }
  };

  const handleUpdateProduct = (productoActualizado) => {
    const productosActualizados = productos.map((producto) =>
      producto.id_producto === productoActualizado.id_producto ? productoActualizado : producto
    );
    setProductos(productosActualizados);
    setEditModalOpen(false); // Cierra el modal de edición
  };

// Filtra los productos según el texto de búsqueda
const productosFiltrados = productos.filter((producto) => {
  const nombre = producto.nombre ? producto.nombre.toLowerCase() : '';
  const id = producto.id_producto ? producto.id_producto.toString() : '';
  const precio = producto.precio ? producto.precio.toString() : '';
  const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : '';
  const busquedaLower = buscar.toLowerCase();

  return (
    nombre.includes(busquedaLower) ||
    id.includes(busquedaLower) ||
    precio.includes(busquedaLower) ||
    descripcion.includes(busquedaLower)
  );
});

  // Ordena los productos
  const ordenarProductos = (productos, criterio) => {
    const sorted = [...productos].sort((a, b) => {
      if (criterio === 'nombre') {
        const nombreA = a.nombre || '';
        const nombreB = b.nombre || '';
        return nombreA.localeCompare(nombreB);
      } else if (criterio === 'id') {
        return a.id_producto - b.id_producto;
      } else if (criterio === 'precio') {
        return a.precio - b.precio;
      }
      return 0;
    });
    return ordenAscendente ? sorted : sorted.reverse();
  };

  const productosOrdenados = ordenarProductos(productosFiltrados, criterioOrden);

  const indexOfLastProducto = paginaActual * productosPorPagina;
  const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
  const productosPagina = productosOrdenados.slice(indexOfFirstProducto, indexOfLastProducto);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const handleOpenAddModal = () => {
    console.log('Abriendo el modal de añadir producto');
    setAddModalOpen(true); 
    setEditModalOpen(false); // Cierra el modal de edición si estaba abierto
  };

  return (
    <div className="product-list-container">
      <h2>Lista de Productos</h2>
  
      <div className="search-order-add-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>
  
        <div className="order-options">
          <label>Ordenar por:</label>
          <select value={criterioOrden} onChange={(e) => setCriterioOrden(e.target.value)}>
            <option value="nombre">Nombre</option>
            <option value="id">ID</option>
            <option value="precio">Precio</option>
          </select>
          <button onClick={() => setOrdenAscendente(!ordenAscendente)}>
            {ordenAscendente ? 'Orden Descendente' : 'Orden Ascendente'}
          </button>
        </div>
  
        <div className="add-product-btn">
          <button onClick={handleOpenAddModal}>
            <FaPlus /> Añadir Producto
          </button>
        </div>
      </div>
  
      {/* Contenedor de la tabla con desplazamiento */}
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th onClick={() => setCriterioOrden('id')}>ID</th>
              <th onClick={() => setCriterioOrden('nombre')}>Nombre</th>
              <th>Descripción</th>
              <th onClick={() => setCriterioOrden('precio')}>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(producto)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(producto.id_producto)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Paginación fuera de la tabla */}
      <tfoot>
        <tr>
          <td colSpan="5">
            <div className="pagination">
              {Array.from({ length: Math.ceil(productosFiltrados.length / productosPorPagina) }).map((_, index) => (
                <button
                  key={index + 1}
                  className={paginaActual === index + 1 ? 'active' : ''}
                  onClick={() => cambiarPagina(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </td>
        </tr>
      </tfoot>
  
      {/* Modal para agregar producto */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
          <AddProduct onAddProduct={handleAddProduct} onClose={() => setAddModalOpen(false)} />
        </Modal>
      )}
  
      {/* Modal para editar producto */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <EditProduct
            producto={productoSeleccionado}
            onUpdate={handleUpdateProduct}
            onClose={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );  
};

export default ProductList;
