import { useState } from 'react';
import axios from 'axios'; // Importar el paquete axios

import FactTipoPago from './FactTipoPagos';
import TablaFactClientes from './FactClientes';
import TablaProductos from './Productos';
import MaestroDetalle from './FactFactura';
import CrearFactura from './CrearFactura';
import './App.css'; 

function Navbar({ onChangeTable, onLogout }) {
  const apiUrl = "https://facturasapi202307161115.azurewebsites.net/api/FactUsuarios";
   const [usuarios, setUsuarios] = useState([]);

  return (
    <nav>
      <ul>
        <li onClick={() => onChangeTable('factTipoPago')}>TIPOS DE PAGO</li>
        <li onClick={() => onChangeTable('factClientes')}>CLIENTES</li>
        <li onClick={() => onChangeTable('productos')}>PRODUCTOS</li>
        <li onClick={() => onChangeTable('maestroDetalle')}>FACTURA</li>
        <li onClick={() => onChangeTable('crearFactura')}>CREAR FACTURA</li>
        <li onClick={onLogout}>SALIR</li> {/* Nuevo elemento para salir */}
      </ul>
    </nav>
  );
}

function Loging() {
  const [activeTable, setActiveTable] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleTableChange = (table) => {
    setActiveTable(table);
  };

  const handleTitleClick = () => {
    setActiveTable('');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get('https://facturasapi202307161115.azurewebsites.net/api/FactUsers');
      const data = response.data;

      // Verificar si el usuario o el email coincide con los datos proporcionados.
      const userFound = data.find(
        (user) => user.usr_user === username || user.usr_email === username
      );

      if (userFound && userFound.usr_password === password) {
        setLoggedIn(true);
        setError('');
      } else {
        setError('Usuario o contraseña incorrecta');
      }
    } catch (error) {
      setError('Error al comunicarse con el servidor');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false); // Cambiar el estado a false para mostrar el formulario de inicio de sesión.
    setError(''); // Limpiar cualquier mensaje de error.
    setUsername(''); // Limpiar el campo de usuario o email.
    setPassword(''); // Limpiar el campo de contraseña.
  };
  const obtenerUsuariosDesdeAPI = async () => {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los datos de los usuarios:", error);
      return [];
    }
  };

  const actualizarUsuarios = async () => {
    try {
      const response = await axios.get(this.apiUrl);
      console.log(response.data); // Puedes mostrar el mensaje de respuesta si lo deseas
      const usuariosActualizados = response.data;
      setUsuarios(usuariosActualizados);
    } catch (error) {
      console.error("Error al actualizar los usuarios:", error);
    }
  };


  return (
    <div >
      <h1 onClick={handleTitleClick}>MÓDULO FACTURACIÓN</h1>
      {!loggedIn && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Usuario o Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "7px", width: "150px", marginBottom: "8px" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "7px", width: "160px", marginBottom: "8px" }}
        />
        <button onClick={handleLogin} style={{ padding: "8px", width: "200px" }}>
          Iniciar Sesión
        </button>
        {error && <p>{error}</p>}
      </div>
      )}
      {loggedIn && (
        <div>
          <Navbar onChangeTable={handleTableChange} onLogout={handleLogout} />
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
          )}
        </div>
      )}
    </div>
  );
}

export default Loging;
