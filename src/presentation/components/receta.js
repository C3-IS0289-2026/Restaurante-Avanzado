let ingredientes = [];

const platoIdInput = document.getElementById("platoId");
const ingredienteIdInput = document.getElementById("ingredienteId");
const cantidadInput = document.getElementById("cantidad");
const unidadInput = document.getElementById("unidad");

const listaIngredientes = document.getElementById("listaIngredientes");
const costoTotal = document.getElementById("costoTotal");
const mensaje = document.getElementById("mensaje");

const botonAgregar = document.getElementById("agregarIngrediente");
const botonGuardar = document.getElementById("guardarReceta");


// Agrega un ingrediente a la receta
function agregarIngrediente() {

    const ingredienteId = Number(ingredienteIdInput.value);
    const cantidad = Number(cantidadInput.value);
    const unidad = unidadInput.value;

    if (!ingredienteId || ingredienteId <= 0) {
        mostrarMensaje("Ingrese un ID de ingrediente válido.");
        return;
    }

    if (!cantidad || cantidad <= 0) {
        mostrarMensaje("Ingrese una cantidad mayor que cero.");
        return;
    }

    const ingredienteExistente = ingredientes.some(
        ingrediente => ingrediente.ingredienteId === ingredienteId
    );

    if (ingredienteExistente) {
        mostrarMensaje("Este ingrediente ya fue agregado.");
        return;
    }

    const nuevoIngrediente = {
        ingredienteId,
        cantidad,
        unidad
    };

    ingredientes.push(nuevoIngrediente);

    mostrarIngredientes();

    ingredienteIdInput.value = "";
    cantidadInput.value = "";

    mostrarMensaje("Ingrediente agregado correctamente.");
}


// Muestra los ingredientes en la página
function mostrarIngredientes() {

    listaIngredientes.innerHTML = "";

    ingredientes.forEach((ingrediente, index) => {

        const item = document.createElement("li");

        const informacion = document.createElement("span");

        informacion.textContent =
            `Ingrediente ${ingrediente.ingredienteId} - ` +
            `${ingrediente.cantidad} ${ingrediente.unidad}`;

        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            eliminarIngrediente(index);
        });

        item.appendChild(informacion);
        item.appendChild(botonEliminar);

        listaIngredientes.appendChild(item);
    });
}


// Elimina un ingrediente de la receta
function eliminarIngrediente(index) {

    ingredientes.splice(index, 1);

    mostrarIngredientes();

    mostrarMensaje("Ingrediente eliminado.");
}


// Envía la receta al backend
async function guardarReceta() {

    const platoId = Number(platoIdInput.value);

    if (!platoId || platoId <= 0) {
        mostrarMensaje("Ingrese un ID de platillo válido.");
        return;
    }

    if (ingredientes.length === 0) {
        mostrarMensaje("Debe agregar al menos un ingrediente.");
        return;
    }

    const datosReceta = {
        platoId,
        ingredientes
    };

    try {

        const respuesta = await fetch("/api/recetas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosReceta)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje);
        }

        costoTotal.textContent =
            Number(resultado.costoTotal).toFixed(2);

        mostrarMensaje(resultado.mensaje);

        ingredientes = [];

        mostrarIngredientes();

    } catch (error) {

        mostrarMensaje(
            `Error: ${error.message}`
        );
    }
}


// Muestra mensajes al usuario
function mostrarMensaje(texto) {
    mensaje.textContent = texto;
}


// Eventos de los botones
botonAgregar.addEventListener(
    "click",
    agregarIngrediente
);

botonGuardar.addEventListener(
    "click",
    guardarReceta
);