import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://facturasapi202307161115.azurewebsites.net/api/FactClientes';

const TablaFactClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    Identificacion: '',
    Nombre: '',
    FechaNacimiento: '01/02/2020',
    Direccion: '',
    Telefono: '',
    CorreoElectronico: '',
    Estado: true,
  });
  const [editingCliente, setEditingCliente] = useState(null); // Estado para el cliente que se está editando

  const loadData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (identificacion) => {
    try {
      // Hacer una solicitud PUT o PATCH para actualizar el cliente en la API
      await axios.put(`${apiUrl}/${identificacion}`, formData);
      loadData();
      setEditingCliente(null); // Limpiar el cliente que se está editando
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl, formData);
      loadData();
      setFormData({
        Identificacion: '',
        Nombre: '',
        FechaNacimiento: '',
        Direccion: '',
        Telefono: '',
        CorreoElectronico: '',
        Estado: true,
      });
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };
  

  const handleDelete = async (identificacion) => {
    try {
      await axios.delete(`${apiUrl}/${identificacion}`);
      loadData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente); // Establecer el cliente que se está editando
    setFormData(cliente); // Actualizar el formulario con los datos del cliente para editar
  };

  return (
    <div>
      <h2>TABLA DE CLIENTES</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Identificación"
          value={formData.Identificacion}
          onChange={(e) => setFormData({ ...formData, Identificacion: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={formData.Nombre}
          onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
        />
        <input
          type="date"
          placeholder="Fecha de Nacimiento"
          value={formData.FechaNacimiento}
          onChange={(e) => setFormData({ ...formData, FechaNacimiento: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={formData.Direccion}
          onChange={(e) => setFormData({ ...formData, Direccion: e.target.value })}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formData.Telefono}
          onChange={(e) => setFormData({ ...formData, Telefono: e.target.value })}
        />
        <input
          type="text"
          placeholder="Correo Electrónico"
          value={formData.CorreoElectronico}
          onChange={(e) => setFormData({ ...formData, CorreoElectronico: e.target.value })}
        />
        <label htmlFor="estado">Estado</label>
        <input
          id="estado"
          type="checkbox"
          checked={formData.Estado}
          onChange={(e) => setFormData({ ...formData, Estado: e.target.checked })}
        />
        <button type="submit">Agregar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Identificación</th>
            <th>Nombre</th>
            <th>Fecha de Nacimiento</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.Identificacion}>
              <td>{cliente.Identificacion}</td>
              <td>{cliente.Nombre}</td>
              <td>{new Date(cliente.FechaNacimiento).toLocaleDateString()}</td>
              <td>{cliente.Direccion}</td>
              <td>{cliente.Telefono}</td>
              <td>{cliente.CorreoElectronico}</td>
              <td>{cliente.Estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => handleEdit(cliente)}>Leer Dato</button>
                <button onClick={() => handleDelete(cliente.Identificacion)}>Eliminar</button>
                <button onClick={() => handleUpdate(cliente.Identificacion)}>Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaFactClientes;
