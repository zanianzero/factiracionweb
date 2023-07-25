import { useState, useEffect } from 'react';
import axios from 'axios';
import './FactTipoPagos.css'

const apiUrl = 'https://facturasapi202307161115.azurewebsites.net/api/FactTipoPagos';

const TablaFactTipoPagos = () => {
  const [tipoPagos, setTipoPagos] = useState([]);
  const [formData, setFormData] = useState({ IdTipoPago: '', Tipo: '' });

  const loadData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTipoPagos(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl, formData);
      loadData();
      setFormData({ IdTipoPago: '', Tipo: '' });
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      // Hacer una solicitud PUT o PATCH para actualizar el tipo de pago en la API
      await axios.put(`${apiUrl}/${id}`, formData);
      loadData();
      setFormData({ IdTipoPago: '', Tipo: '' });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div>
      <h2>TIPOS DE PAGOS</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          value={formData.IdTipoPago}
          onChange={(e) => setFormData({ ...formData, IdTipoPago: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tipo"
          value={formData.Tipo}
          onChange={(e) => setFormData({ ...formData, Tipo: e.target.value })}
        />
        <button type="submit">Agregar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipoPagos.map((tipoPago) => (
            <tr key={tipoPago.IdTipoPago}>
              <td>{tipoPago.IdTipoPago}</td>
              <td>{tipoPago.Tipo}</td>
              <td>
                <button onClick={() => setFormData({ IdTipoPago: tipoPago.IdTipoPago, Tipo: tipoPago.Tipo })}>
                  Leer Dato
                </button>
                <button onClick={() => handleDelete(tipoPago.IdTipoPago)}>Eliminar</button>
                <button onClick={() => handleUpdate(tipoPago.IdTipoPago)}>Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaFactTipoPagos;
