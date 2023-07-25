import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://facturasapi202307161115.azurewebsites.net/api/productos';

const TablaProductos = () => {
  const [productos, setProductos] = useState([]);

  const obtenerProductosDesdeAPI = async () => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los datos de los productos:', error);
      return [];
    }
  };

  const actualizarProductos = async () => {
    try {
      const response = await axios.get('https://facturasapi202307161115.azurewebsites.net/guardarproductos');
      console.log(response.data); // Puedes mostrar el mensaje de respuesta si lo deseas
      const productosActualizados = await obtenerProductosDesdeAPI();
      setProductos(productosActualizados);
    } catch (error) {
      console.error('Error al actualizar los productos:', error);
    }
  };

  const handleMostrarProductos = async () => {
    const productosObtenidos = await obtenerProductosDesdeAPI();
    setProductos(productosObtenidos);
  };

  const handleObtenerProductos = () => {
    actualizarProductos();
  };

  useEffect(() => {
    // Mostrar la lista de productos al cargar el componente
    handleMostrarProductos();
  }, []);

  return (
    <div>
      <h2>TABLA DE PRODUCTOS</h2>
    
      <button  onClick={handleObtenerProductos}> Actualizar Productos</button>
      {productos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Valor IVA</th>
              <th>Costo</th>
              <th>PVP</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.pro_id}>
                <td>{producto.pro_id}</td>
                <td>{producto.pro_nombre}</td>
                <td>{producto.pro_descripcion}</td>
                <td>{producto.pro_valor_iva ? "Sí" : "No"}</td>
                <td>{producto.pro_costo}</td>
                <td>{producto.pro_pvp}</td>
                <td>
                  <img src={producto.pro_imagen} alt={producto.pro_nombre} style={{ width: '100px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaProductos;
