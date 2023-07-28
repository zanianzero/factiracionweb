import { useState } from 'react';
import FactTipoPago from './FactTipoPagos';
import TablaFactClientes from './FactClientes';
import TablaProductos from './Productos';
import MaestroDetalle from './FactFactura';
import CrearFactura from './CrearFactura';
import './App.css'; 
import Loging from './logging';

// function Navbar({ onChangeTable }) {
//   return (
//     <nav>
//       <ul>
//         <li onClick={() => onChangeTable('factTipoPago')}>TIPOS DE PAGO</li>
//         <li onClick={() => onChangeTable('factClientes')}>CLIENTES </li>
//         <li onClick={() => onChangeTable('productos')}>PRODUCTOS</li>
//         <li onClick={() => onChangeTable('maestroDetalle')}>FACTURA </li>
//         <li onClick={() => onChangeTable('crearFactura')}>CREAR FACTURA</li>
//       </ul>
//     </nav>
//   );
// }

// function Footer() {
//   return <footer>Grupo 5</footer>;
// }

function App() {
  // const [activeTable, setActiveTable] = useState('');

  // const handleTableChange = (table) => {
  //   setActiveTable(table);
  // };

  // const handleTitleClick = () => {
  //   setActiveTable(''); // Setea el estado a una cadena vacía para volver al estado por defecto (imagen de facturación).
  // };

  return (
    <div>
      {/* <h1 onClick={handleTitleClick}>MÓDULO FACTURACIÓN </h1>
      <Navbar onChangeTable={handleTableChange} />
      {activeTable === 'factTipoPago' && <FactTipoPago />}
      {activeTable === 'factClientes' && <TablaFactClientes />}
      {activeTable === 'productos' && <TablaProductos />}
      {activeTable === 'maestroDetalle' && <MaestroDetalle />}
      {activeTable === 'crearFactura' && <CrearFactura />}
      {activeTable === '' && (
        <img
          src={"https://img.freepik.com/vector-premium/pago-facturas-traves-modulo-nfc-smarthone_380181-35.jpg"}
          alt="Facturación"
          width="300"
          height="200"
        />
      )} */}
    <Loging/>
    </div>
  );
}

export default App;
