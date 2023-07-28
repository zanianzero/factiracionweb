import { useState, useEffect, useRef } from "react";
import axios from "axios";

const apiUrl =
  "https://facturasapi202307161115.azurewebsites.net/api/FactClientes";

const TablaFactClientes = () => {
  const [clientes, setClientes] = useState([]);
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    Identificacion: "",
    Nombre: "",
    FechaNacimiento: "01/02/2020",
    Direccion: "",
    Telefono: "",
    CorreoElectronico: "",
    Estado: true,
  });
  const [editingCliente, setEditingCliente] = useState(null); // Estado para el cliente que se está editando

  const loadData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      console.error("Error updating data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl, formData);
      loadData();
      setFormData({
        Identificacion: "",
        Nombre: "",
        FechaNacimiento: "",
        Direccion: "",
        Telefono: "",
        CorreoElectronico: "",
        Estado: true,
      });
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleDelete = async (identificacion) => {
    try {
      await axios.delete(`${apiUrl}/${identificacion}`);
      loadData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente); // Establecer el cliente que se está editando
    setFormData(cliente); // Actualizar el formulario con los datos del cliente para editar
  };
  const handleImprimirDetalles = () => {
    const ventanaImprimir = window.open("", "", "height=500,width=800");
    ventanaImprimir.document.write("<html><head>");
    ventanaImprimir.document.write("<title>Reporte de Clientes</title>");
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
    ventanaImprimir.document.write("<h1>Reporte de Clientes</h1>");
    ventanaImprimir.document.write("</div>");

    // Tabla de clientes
    ventanaImprimir.document.write("<h2>TABLA DE CLIENTES</h2>");
    ventanaImprimir.document.write("<table>");
    ventanaImprimir.document.write("<thead>");
    ventanaImprimir.document.write("<tr>");
    ventanaImprimir.document.write("<th>Identificación</th>");
    ventanaImprimir.document.write("<th>Nombre</th>");
    ventanaImprimir.document.write("<th>Fecha de Nacimiento</th>");
    ventanaImprimir.document.write("<th>Dirección</th>");
    ventanaImprimir.document.write("<th>Teléfono</th>");
    ventanaImprimir.document.write("<th>Correo Electrónico</th>");
    ventanaImprimir.document.write("<th>Estado</th>");
    ventanaImprimir.document.write("</tr>");
    ventanaImprimir.document.write("</thead>");
    ventanaImprimir.document.write("<tbody>");

    clientes.forEach((cliente) => {
      ventanaImprimir.document.write("<tr>");
      ventanaImprimir.document.write(`<td>${cliente.Identificacion}</td>`);
      ventanaImprimir.document.write(`<td>${cliente.Nombre}</td>`);
      ventanaImprimir.document.write(
        `<td>${new Date(cliente.FechaNacimiento).toLocaleDateString()}</td>`
      );
      ventanaImprimir.document.write(`<td>${cliente.Direccion}</td>`);
      ventanaImprimir.document.write(`<td>${cliente.Telefono}</td>`);
      ventanaImprimir.document.write(`<td>${cliente.CorreoElectronico}</td>`);
      ventanaImprimir.document.write(
        `<td>${cliente.Estado ? "Activo" : "Inactivo"}</td>`
      );
      ventanaImprimir.document.write("</tr>");
    });

    ventanaImprimir.document.write("</tbody>");
    ventanaImprimir.document.write("</table>");

    ventanaImprimir.document.write("</body></html>");
    ventanaImprimir.document.close();
    ventanaImprimir.print();
  };

  const handleIdentificacionChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 13); // Elimina todos los caracteres que no sean dígitos
    setFormData({ ...formData, Identificacion: value });
  };

  const handleNombreChange = (e) => {
    // Permite solo letras
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setFormData({ ...formData, Nombre: value });
  };

  const handleFechaNacimientoChange = (e) => {
    // Limita la fecha máxima a la fecha actual
    const today = new Date().toISOString().split("T")[0];
    const value = e.target.value > today ? today : e.target.value;
    setFormData({ ...formData, FechaNacimiento: value });
  };

  const handleDireccionChange = (e) => {
    // Permite letras, números y los caracteres - _ # y .
    const value = e.target.value.replace(/[^a-zA-Z0-9-_#.\s]/g, "");
    setFormData({ ...formData, Direccion: value });
  };

  const handleTelefonoChange = (e) => {
    // Permite solo números y limita la longitud a 10 caracteres
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setFormData({ ...formData, Telefono: value });
  };



  // const validateEmail = () => {
  //   // Assuming you have an input field with the ID 'user-email'.
  //   var emailField = document.getElementById("user-email");

  //   // Define the regular expression for email validation.
  //   var validEmailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  //   // Using test, we can check if the text matches the pattern.
  //   if (validEmailRegex.test(emailField.value)) {
  //     alert("Email is valid, continue with form submission");
  //     return true;
  //   } else {
  //     alert("Email is invalid, skip form submission");
  //     return false;
  //   }
  // };
  const handleCorreoElectronicoChange = (e) => {
    setFormData({ ...formData, CorreoElectronico: e.target.value });
  };
  const isEmailValid = (email) => {
    const validEmailRegex = "^[^\s@]+@[^\s@]+\.[^\s@]+$";
    return validEmailRegex.test(email);
  };
  return (
    <div>
      <h2>TABLA DE CLIENTES</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Identificación"
            value={formData.Identificacion}
            onChange={handleIdentificacionChange}
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Nombre"
            value={formData.Nombre}
            onChange={handleNombreChange}
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="date"
            placeholder="Fecha de Nacimiento"
            value={formData.FechaNacimiento}
            onChange={handleFechaNacimientoChange}
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formData.Direccion}
            onChange={handleDireccionChange}
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={formData.Telefono}
            onChange={handleTelefonoChange}
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Correo Electrónico"
            value={formData.CorreoElectronico}
            onChange={handleCorreoElectronicoChange} // Agrega este onChange handler
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <label
            htmlFor="estado"
            style={{
              backgroundColor: "#ffffff",
              color: "black",
              padding: "5px 10px",
              borderRadius: "3px",
              display: "inline-block",
              textAlign: "center",
              width: "40px",
              height: "23px",
            }}
          >
            Estado
          </label>

          <input
            id="estado"
            type="checkbox"
            checked={formData.Estado}
            onChange={(e) =>
              setFormData({ ...formData, Estado: e.target.checked })
            }
            style={{ marginBottom: "10px" }}
          />
          <button
            type="submit"
            style={{
              padding: "8px",
              fontSize: "14px",
              alignSelf: "flex-start",
            }}
            disabled={!isEmailValid}
          >
            Agregar
          </button>
        </form>
      </div>
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
        <tbody ref={sectionRef}>
          {clientes.map((cliente) => (
            <tr key={cliente.Identificacion}>
              <td>{cliente.Identificacion}</td>
              <td>{cliente.Nombre}</td>
              <td>{new Date(cliente.FechaNacimiento).toLocaleDateString()}</td>
              <td>{cliente.Direccion}</td>
              <td>{cliente.Telefono}</td>
              <td>{cliente.CorreoElectronico}</td>
              <td>{cliente.Estado ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => handleEdit(cliente)}>Leer Dato</button>
                <button onClick={() => handleDelete(cliente.Identificacion)}>
                  Eliminar
                </button>
                <button onClick={() => handleUpdate(cliente.Identificacion)}>
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaFactClientes;
