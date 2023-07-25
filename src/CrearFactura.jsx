import { useState, useEffect } from "react";
import axios from "axios";
const CrearFactura = () => {
  // Estados para la cabecera
  const [fechaFactura, setFechaFactura] = useState(formatoFechaActual());
  const [subtotal, setSubtotal] = useState("");
  const [iva, setIva] = useState("");
  const [total, setTotal] = useState("");
  const [estado, setEstado] = useState(true);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [idCliente, setIdCliente] = useState("");
  const [idTipoPago, setIdTipoPago] = useState("");

  // Estados para el detalle
  const [cantidad, setCantidad] = useState("");
  const [producto, setProducto] = useState("");

  // Estado para almacenar todos los detalles ingresados
  const [detalles, setDetalles] = useState([]);

  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);

  // Estado para almacenar la lista de clientes
  const [clientes, setClientes] = useState([]);

  // Estado para almacenar la lista de tipos de pago
  const [tiposPago, setTiposPago] = useState([]);

  // Función para obtener la lista de productos desde la API
  useEffect(() => {
    axios
      .get("https://facturasapi202307161115.azurewebsites.net/api/productos")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de productos:", error);
      });
  }, []);

  // Función para obtener la lista de clientes desde la API
  useEffect(() => {
    axios
      .get("https://facturasapi202307161115.azurewebsites.net/api/FactClientes")
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de clientes:", error);
      });
  }, []);

  // Función para obtener la lista de tipos de pago desde la API
  useEffect(() => {
    axios
      .get(
        "https://facturasapi202307161115.azurewebsites.net/api/FactTipoPagos"
      )
      .then((response) => {
        setTiposPago(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la lista de tipos de pago:", error);
      });
  }, []);

  // Función para guardar la factura (cabecera y detalle)
  const guardarFactura = () => {

      // Validar que se hayan llenado todos los campos de la cabecera y el detalle
    if (
        fechaFactura === "" ||
        subtotal === "" ||
        iva === "" ||
        total === "" ||
        idCliente === "" ||
        idTipoPago === "" ||
        detalles.length === 0
    ) {
        alert("Falta llenar campos de la cabecera o detalle.");
        return;
    }

    // Obtener el cliente seleccionado de la lista de clientes
    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.Identificacion === idCliente
    );

    // Obtener el tipo de pago seleccionado de la lista de tipos de pago
    const tipoPagoSeleccionado = tiposPago.find(
      (tipoPago) => tipoPago.IdTipoPago === parseInt(idTipoPago)
    );

    // Crear objeto de cabecera
    const nuevaCabecera = {
      FechaFactura: fechaFactura,
      Subtotal: subtotal,
      Iva: iva,
      Total: total,
      Estado: estado,
      NumeroFactura: numeroFactura,
      IdentificacionCliente: clienteSeleccionado
        ? clienteSeleccionado.Identificacion
        : "",
      IdTipo: tipoPagoSeleccionado ? tipoPagoSeleccionado.IdTipoPago : "",
      Detalles: detalles,
    };

    // Hacer la solicitud POST para guardar la factura en la API
    axios
      .post(
        "https://facturasapi202307161115.azurewebsites.net/api/FactFacturacion",
        nuevaCabecera
      )
      .then((response) => {
        console.log("Factura registrada correctamente:", response.data);
        // Limpiar los campos de la cabecera y los detalles después de guardar la factura
        setFechaFactura("");
        setSubtotal("");
        setIva("");
        setTotal("");
        setNumeroFactura('');
        setIdCliente("");
        setIdTipoPago("");
        setDetalles([]);
      })
      .catch((error) => {
        console.error("Error al registrar la factura:", error);
      });
  };

      // Función para calcular el subtotal, el iva y el total de la factura
    useEffect(() => {
        let subtotalFactura = 0;
        let ivaFactura = 0;

        detalles.forEach((detalle) => {
        subtotalFactura += parseFloat(detalle.Subtotal);
        });

        ivaFactura = (subtotalFactura * 0.12).toFixed(2);
        const totalFactura = (subtotalFactura + parseFloat(ivaFactura)).toFixed(2);

        setSubtotal(subtotalFactura.toFixed(2));
        setIva(ivaFactura);
        setTotal(totalFactura);
    }, [detalles]);

        

    const calcularSubtotalDetalle = (cantidad, precioUnitario, incluirIVA = true) => {
        let subtotalDetalle = cantidad * precioUnitario;
    
        if (incluirIVA) {
        subtotalDetalle += subtotalDetalle * 0.12; // Aplicar IVA del 12%
        }


    
        return subtotalDetalle.toFixed(2);
    };

  
    const agregarDetalle = () => {
        const productoSeleccionado = productos.find((p) => p.pro_id === parseInt(producto));
    
        if (productoSeleccionado && cantidad > 0 && cantidad <= productoSeleccionado.pro_stock) {
        const detalleExistente = detalles.find((detalle) => detalle.IdProducto === producto);
        if (detalleExistente) {
            // Si el producto ya está en los detalles, actualizamos la cantidad
            const cantidadTotal = detalleExistente.Cantidad + parseInt(cantidad);
            if (cantidadTotal > productoSeleccionado.pro_stock) {
            alert('La cantidad ingresada supera el stock disponible del producto.');
            } else {
            const newDetalles = detalles.map((detalle) => {
                if (detalle.IdProducto === producto) {
                return {
                    ...detalle,
                    Cantidad: cantidadTotal,
                    Subtotal: calcularSubtotalDetalle(cantidadTotal, productoSeleccionado.pro_pvp, productoSeleccionado.pro_valor_iva),
                };
                }
                return detalle;
            });
            setDetalles(newDetalles);
            }
        } else {
            // Si el producto no está en los detalles, lo agregamos como un nuevo detalle
            const nuevoDetalle = {
            Cantidad: parseInt(cantidad),
            Subtotal: calcularSubtotalDetalle(parseInt(cantidad), productoSeleccionado.pro_pvp, productoSeleccionado.pro_valor_iva),
            IdProducto: producto,
            };
            setDetalles([...detalles, nuevoDetalle]);
        }
    
        // Limpiar los campos del detalle después de agregarlo
        setCantidad("");
        setProducto("");
        } else {
        alert('La cantidad ingresada no es válida o supera el stock disponible del producto.');
        }
    };
  
  

  // Efecto para actualizar el estado "estado" según el tipo de pago seleccionado
  useEffect(() => {
    const tipoPagoSeleccionado = tiposPago.find(
      (tipoPago) => tipoPago.IdTipoPago === parseInt(idTipoPago)
    );
    if (tipoPagoSeleccionado) {
      setEstado(tipoPagoSeleccionado.Tipo === "EFECTIVO");
    } else {
      // Si no se encuentra el tipo de pago seleccionado, establecer estado en true
      setEstado(true);
    }
  }, [idTipoPago, tiposPago]);


    // Función para obtener la fecha actual en formato "aaaa-mm-dd"
    function formatoFechaActual() {
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear();
        return `${anio}/${mes}/${dia}`;
    }

    // Función para eliminar un detalle de la lista de detalles
    const eliminarDetalle = (index) => {
        // Filtrar la lista de detalles para excluir el detalle en el índice especificado
        const nuevosDetalles = detalles.filter((detalle, i) => i !== index);
        setDetalles(nuevosDetalles);
      };
      
      

    // Función para obtener el nombre del producto por su ID
    const getNombreProducto = (productoId) => {
        const productoEncontrado = productos.find(
        (producto) => producto.pro_id === parseInt(productoId)
        );
        return productoEncontrado ? productoEncontrado.pro_nombre : "Producto no encontrado";
    };
    
    // Función para obtener el precio del producto por su ID
    const getPrecioProducto = (productoId) => {
        const productoEncontrado = productos.find(
        (producto) => producto.pro_id === parseInt(productoId)
        );
        return productoEncontrado ? productoEncontrado.pro_pvp : 0;
    };

    // Función para obtener el precio del producto por su ID
    const getStock = (productoId) => {
        const productoEncontrado = productos.find(
        (producto) => producto.pro_id === parseInt(productoId)
        );
        return productoEncontrado ? productoEncontrado.pro_stock : 0;
    };
    
  return (
    <div>
      <h2>CREAR NUEVA FACTURA</h2>
      <div>
        {/* Formulario para ingresar los datos de la cabecera */}
        <label htmlFor="fechaFactura">Fecha:</label>
      <input
        type="text"
        readOnly
        value={fechaFactura}
        onChange={(e) => setFechaFactura(e.target.value)}
        style={{ width: "76px", height: "1px", fontSize: "15px" }}
      />

        <input
          type="hidden"
          placeholder="Número de Factura"
          value={numeroFactura}
          onChange={(e) => setNumeroFactura(e.target.value)}
        />
        
        <select
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.Identificacion} value={cliente.Identificacion}>
              {cliente.Nombre} - {cliente.Identificacion}
            </option>
          ))}
        </select>
        <select
          value={idTipoPago}
          onChange={(e) => setIdTipoPago(e.target.value)}
        >
          <option value="">Seleccionar Tipo de Pago</option>
          {tiposPago.map((tipoPago) => (
            <option key={tipoPago.IdTipoPago} value={tipoPago.IdTipoPago}>
              {tipoPago.Tipo}
            </option>
          ))}
        </select>
        {/* ... Otros inputs para el resto de datos de la cabecera ... */}
        <h3>DETALLES DE FACTURA</h3>
      {/* Aquí va el formulario para ingresar los detalles de la factura */}
      <input
        type="number"
        placeholder="Cantidad"
        required
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />
     <select value={producto} onChange={(e) => setProducto(e.target.value)}>
        <option value="">Seleccionar Producto</option>
        {productos
            .filter((producto) => producto.pro_stock > 0)
            .map((producto) => (
            <option key={producto.pro_id} value={producto.pro_id}>
                {producto.pro_nombre}
            </option>
            ))}
    </select>
      {/* ... Otros inputs para el resto de datos del detalle ... */}
      <button onClick={agregarDetalle}>Agregar Detalle</button>

      {/* Aquí mostramos la tabla con los detalles ingresados */}
      <table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio Unitario</th>
      <th>Subtotal</th>
      <th>Stock</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
  {detalles.map((detalle, index) => (
    <tr key={index}>
      <td>{getNombreProducto(detalle.IdProducto)}</td>
      <td>{detalle.Cantidad}</td>
      <td>{getPrecioProducto(detalle.IdProducto)}</td>
      <td>{detalle.Subtotal}</td>
      <td>{getStock(detalle.IdProducto)}</td>
      <td>
        <button onClick={() => eliminarDetalle(index)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="currentColor"
            className="bi bi-trash-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
            />
          </svg>
        </button>
      </td>
    </tr>
  ))}
</tbody>

</table>


      <div>
        <table>
          <tr>
            <td>SUBTOTAL:</td>
            <td>{subtotal}</td>
          </tr>
          <tr>
            <td>IVA:</td>
            <td>{iva}</td>
          </tr>
          <tr>
            <td>TOTAL:</td>
            <td>{total}</td>
          </tr>
        </table>
      </div>
    </div>

    {/* Botón para ingresar la factura */}
    <button onClick={guardarFactura}>CREAR FACTURA</button>
  </div>
);
};

export default CrearFactura;
