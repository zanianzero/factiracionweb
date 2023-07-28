import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const apiUrl = 'https://facturasapi202307161115.azurewebsites.net/api/productos';

const TablaProductos = () => {
  const [productos, setProductos] = useState([]);
   const sectionRef = useRef(null);


   
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
  const handleImprimirDetalles = () => {
    const ventanaImprimir = window.open("", "", "height=500,width=800");
    ventanaImprimir.document.write("<html><head>");
    ventanaImprimir.document.write("<title>Reporte de Productos</title>");
    ventanaImprimir.document.write("<style>");
    ventanaImprimir.document.write(`
      body {
        font-family: Arial, sans-serif;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      h1, h2, h3 {
        text-align: center;
      }
      /* Agrega más estilos según tus necesidades */
    `);
    ventanaImprimir.document.write("</style>");
    ventanaImprimir.document.write("</head><body>");
    ventanaImprimir.document.write('<div style="text-align: center;">');
    ventanaImprimir.document.write("<h1>Reporte de Productos</h1>");
    ventanaImprimir.document.write("</div>");
  
    // Tabla de productos
    ventanaImprimir.document.write("<h2>TABLA DE PRODUCTOS</h2>");
    ventanaImprimir.document.write("<table>");
    ventanaImprimir.document.write("<thead>");
    ventanaImprimir.document.write("<tr>");
    ventanaImprimir.document.write("<th>ID</th>");
    ventanaImprimir.document.write("<th>Nombre</th>");
    ventanaImprimir.document.write("<th>Descripción</th>");
    ventanaImprimir.document.write("<th>Valor IVA</th>");
    ventanaImprimir.document.write("<th>Costo</th>");
    ventanaImprimir.document.write("<th>PVP</th>");
    ventanaImprimir.document.write("<th>Stock</th>");
    ventanaImprimir.document.write("</tr>");
    ventanaImprimir.document.write("</thead>");
    ventanaImprimir.document.write("<tbody>");
  
    productos.forEach((producto) => {
      ventanaImprimir.document.write("<tr>");
      ventanaImprimir.document.write(`<td>${producto.pro_id}</td>`);
      ventanaImprimir.document.write(`<td>${producto.pro_nombre}</td>`);
      ventanaImprimir.document.write(`<td>${producto.pro_descripcion}</td>`);
      ventanaImprimir.document.write(`<td>${producto.pro_valor_iva ? "Sí" : "No"}</td>`);
      ventanaImprimir.document.write(`<td>${producto.pro_costo}</td>`);
      ventanaImprimir.document.write(`<td>${producto.pro_pvp}</td>`);
      ventanaImprimir.document.write(`<td>${producto.pro_stock}</td>`);
      ventanaImprimir.document.write("</tr>");
    });
  
    ventanaImprimir.document.write("</tbody>");
    ventanaImprimir.document.write("</table>");
  
    ventanaImprimir.document.write("</body></html>");
    ventanaImprimir.document.close();
    ventanaImprimir.print();
  };
  

  
  return (
    <div>
      <h2>TABLA DE PRODUCTOS</h2>
    
      <button  onClick={handleObtenerProductos}> Actualizar Productos</button>
      {productos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>DESCRIPCÍON</th>
              <th>VALOR IVA</th>
              <th>COSTO</th>
              <th>PVP</th>
              <th>STOCK</th>
              <th>IMAGEN</th>
            </tr>
          </thead>
          <tbody ref={sectionRef}>
            {productos.map((producto) => (
              <tr key={producto.pro_id}>
                <td>{producto.pro_id}</td>
                <td>{producto.pro_nombre}</td>
                <td>{producto.pro_descripcion}</td>
                <td>{producto.pro_valor_iva ? "Sí" : "No"}</td>
                <td>{producto.pro_costo}</td>
                <td>{producto.pro_pvp}</td>
                <td>{producto.pro_stock}</td>
                <td>
                  <img src={producto.pro_imagen} alt={producto.pro_nombre} style={{ width: '100px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleImprimirDetalles}>
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="45"
          height="45"
          style={{ color: "red" }}
          fill="currentColor"
          class="bi bi-filetype-pdf"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default TablaProductos;
