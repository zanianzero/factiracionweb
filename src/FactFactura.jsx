import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const apiUrlCabecera = 'https://facturasapi202307161115.azurewebsites.net/api/FactFacturaCabecera';
const apiUrlDetalle = 'https://facturasapi202307161115.azurewebsites.net/api/FactDetalleFactura/FacturaCabecera';
const apiUrlProductos = 'https://facturasapi202307161115.azurewebsites.net/api/productos';

const MaestroDetalle = () => {

  const sectionRef = useRef(null); // Referencia a la sección que se imprimirá
  const [showButton, setShowButton] = useState(true); // Estado para mostrar/ocultar el botón

    // Estado para almacenar la lista de clientes
  const [clientes, setClientes] = useState([]);
  const [cabeceras, setCabeceras] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCabecera, setSelectedCabecera] = useState(null);

  useEffect(() => {
    // Obtener las cabeceras de factura al cargar la página
    axios.get(apiUrlCabecera)
      .then((response) => {
        setCabeceras(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las cabeceras de factura:', error);
      });
      // Función para obtener la lista de clientes desde la API
    axios.get('https://facturasapi202307161115.azurewebsites.net/api/FactClientes')
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener la lista de clientes:', error);
      });
 

    // Obtener la lista de productos para mostrar los nombres en lugar de los IDs
    axios.get(apiUrlProductos)
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener la lista de productos:', error);
      });
  }, []);

  const handleRowClick = (cabecera) => {
    // Obtener los detalles de la factura al hacer clic en una fila de la tabla de cabeceras
    axios.get(`${apiUrlDetalle}/${cabecera.IdFacturaCabecera}`)
      .then((response) => {
        // Filtrar detalles duplicados por IdDetalleFactura
        const uniqueDetalles = response.data.filter((detalle, index, self) =>
          index === self.findIndex((d) => d.IdDetalleFactura === detalle.IdDetalleFactura)
        );

        setDetalles(uniqueDetalles);
        setSelectedCabecera(cabecera);

        // Enfocar la sección de detalles de factura al seleccionar una cabecera
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });

      })
      .catch((error) => {
        console.error('Error al obtener los detalles de la factura:', error);
      });
  };

  const handleImprimirDetalles = () => {
    setShowButton(false);
  
    const contenido = sectionRef.current.innerHTML;
    const ventanaImprimir = window.open('', '', 'height=500,width=800');
    ventanaImprimir.document.write('<html><head>');
    ventanaImprimir.document.write('<title>Detalles de Factura</title>');
    ventanaImprimir.document.write('<style>');
    ventanaImprimir.document.write(`
      body {
        font-family: Arial, sans-serif;
      }
      table {
        border-collapse: collapse;
        width: 100%;
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
    ventanaImprimir.document.write('</style>');
    ventanaImprimir.document.write('</head><body>');
    ventanaImprimir.document.write('<div style="text-align: center;">');
    ventanaImprimir.document.write('<h1>Reporte Factura</h1>');
    ventanaImprimir.document.write('</div>');
    ventanaImprimir.document.write(contenido);
    ventanaImprimir.document.write('</body></html>');
    ventanaImprimir.document.close();
    ventanaImprimir.print();
    ventanaImprimir.close();
  
    setShowButton(true);
  };
  
  


  // Función para formatear la fecha en formato "dd/mm/aaaa"
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };


  return (
    <div>
    <h2>LISTADO DE FACTURAS</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>NÚMERO FACTURA </th>
          <th>FECHA FACTURA</th>
          <th>CLIENTE</th>
          <th>SUBTOTAL</th>
          <th>IVA</th>
          <th>TOTAL</th>
          <th>ESTADO</th>
        </tr>
      </thead>
      <tbody>
        {cabeceras.map((cabecera, index) => {
          // Encontrar el cliente correspondiente en la lista de clientes
          const cliente = clientes.find((c) => c.Identificacion === cabecera.IdentificacionCliente);

          return (
            <tr key={cabecera.IdFacturaCabecera} onClick={() => handleRowClick(cabecera)}>
              <td>{index + 1}</td>
              <td>{cabecera.IdFacturaCabecera}</td>
              <td>{formatearFecha(cabecera.FechaFactura)}</td> {/* Formatear la fecha */}
              <td>{cliente?.Nombre}</td> {/* Mostrar el nombre del cliente en lugar de la identificación */}
              <td>{cabecera.Subtotal}</td>
              <td>{cabecera.Iva}</td>
              <td>{cabecera.Total}</td>
              <td>{cabecera.Estado ? 'Pagada' : 'Pendiente'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <h3>DETALLES DE FACTURA</h3>
    {selectedCabecera ? (
        <div ref={sectionRef}>
         <table>
      <tbody>
        <tr>
          <td>NÚMERO FACTURA: {selectedCabecera.IdFacturaCabecera}</td>
          {/* Buscar el cliente correspondiente en la lista de clientes */}
          {clientes.map((cliente) => {
            if (cliente.Identificacion === selectedCabecera.IdentificacionCliente) {
              return (
                <td key={cliente.Identificacion}>
                  IDENTIFICACIÓN DEL CLIENTE: {cliente.Identificacion}
                  <br />
                  NOMBRE DEL CLIENTE: {cliente.Nombre}
                </td>
              );
            }
            return null;
          })}
          <td>SUBTOTAL: {selectedCabecera.Subtotal}</td>
          <td>IVA: {selectedCabecera.Iva}</td>
          <td>TOTAL: {selectedCabecera.Total}</td>
        </tr>
      </tbody>
    </table>
      <table>
          <thead>
            <tr>
              <th>CANTIDAD</th>
              <th>PRODUCTO</th>
              <th>PRECIO UNITARIO</th>
              <th>SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle) => {
              const producto = productos.find((p) => p.pro_id === detalle.IdProducto);
              return (
                <tr key={detalle.IdDetalleFactura}>
                  <td>{detalle.Cantidad}</td>
                  <td>{producto?.pro_nombre}</td>
                  <td>{producto?.pro_pvp}</td>
                  <td>{(detalle.Cantidad * parseFloat(producto?.pro_pvp)).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
            {/* Mostrar el botón solo si showButton es verdadero */}
            {showButton && (
               <button  className="pdf-button" title='Reporte PDF' onClick={handleImprimirDetalles} >
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" style={{ color: 'red' }} fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                </svg>
             </button>
            )}
          </div>
      </div>
    ) : (
      <p>Selecciona una cabecera para ver sus detalles.</p>
    )}
  </div>
);
};

export default MaestroDetalle;
