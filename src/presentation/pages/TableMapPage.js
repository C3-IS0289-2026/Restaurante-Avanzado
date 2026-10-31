import { BaseComponent } from '../components/BaseComponent.js';

export class TableMapPage extends BaseComponent {
  constructor() {
    super('div', 'table-map-page');
  }

  template() {
    return `
      <h1>Mapa de Mesas</h1>
      <div class="tables-grid" id="tablesGrid">
        <!-- Renderizar mesas aquí -->
         <div class="contenedor">
   <figure>
          
<div class="cuadro">

  <div id="infoMesa" hidden>

    <h2 id="tituloMesa">Información de mesa</h2>

    <p id="estadoMesa"></p>
    <p id="personasMesa"></p>
    <p id="horaMesa"></p>

    <button id="abrirMesa" type="button" disabled>
      Abrir mesa
    </button>


  </div>

</div>
</figure>
        
        <div class="mapa">

<button type="button" class="mesas mesasLibre" data-id="1">1</button>
<button type="button" class="mesas mesasLibre" data-id="2">2</button>
<button type="button" class="mesas mesasLibre" data-id="3">3</button>      
<button type="button" class="mesas mesasLibre" data-id="4">4</button>      
<button type="button" class="mesas mesasLibre" data-id="5">5</button>      
<button type="button" class="mesas mesasLibre" data-id="6">6</button>      
<button type="button" class="mesas mesasLibre" data-id="7">7</button>      
<button type="button" class="mesas mesasLibre" data-id="8">8</button>      
<button type="button" class="mesas mesasLibre" data-id="9">9</button>      
<button type="button" class="mesas mesasLibre" data-id="10">10</button>      
<button type="button" class="mesas mesasLibre" data-id="11">11</button>      
<button type="button" class="mesas mesasLibre" data-id="12">12</button>      
<button type="button" class="mesas mesasLibre" data-id="13">13</button>      
<button type="button" class="mesas mesasLibre" data-id="14">14</button>      
<button type="button" class="mesas mesasLibre" data-id="15">15</button>      
      
    </div>
  </div>
      </div>
    <dialog id="dialog">
  <form id="formAbrirMesa">

    <h2>Apertura de mesa</h2>
    <p id="mesaFormulario"></p>

    <label for="numeroPersonas">
      Número de personas:
    </label>

    <input
      type="number"
      id="numeroPersonas"
      min="1"
      step="1"
      required
    >

    <button type="submit">
      Confirmar apertura
    </button>

    <button type="button" id="cancelarDialog">
      Cancelar
    </button>

  </form>
</dialog>
      `
    
    ;
  }


}
function mostrarMesa(pagina, mesa) {
  const numero = mesa.dataset.id;
  const ocupada = mesa.classList.contains('mesasOcupada');

  pagina.querySelector('#tituloMesa').textContent =
    `Mesa ${numero}`;

  pagina.querySelector('#estadoMesa').textContent =
    ocupada ? 'Estado: Ocupada' : 'Estado: Libre';

  pagina.querySelector('#personasMesa').textContent =
    mesa.dataset.personas
      ? `Personas: ${mesa.dataset.personas}`
      : 'Sin personas registradas';

  pagina.querySelector('#horaMesa').textContent =
    mesa.dataset.hora
      ? `Hora: ${mesa.dataset.hora}`
      : '';

  pagina.querySelector('#abrirMesa').disabled = ocupada;
}


// EVENTO PARA SELECCIONAR MESAS
document.addEventListener('click', (event) => {

  const pagina = event.target.closest('.table-map-page');

  if (!pagina) return;

  const mesa = event.target.closest('.mapa .mesas');

  if (mesa) {
    pagina.querySelectorAll('.mapa .mesas').forEach(boton => {
      boton.classList.remove('seleccionada');
    });

    mesa.classList.add('seleccionada');

    // Mostrar la información del recuadro
    pagina.querySelector('#infoMesa').hidden = false;
    
    // Actualizar los datos
    mostrarMesa(pagina, mesa);
    
    return;  
  }

  // ABRIR FORMULARIO
  if (event.target.id === 'abrirMesa') {

    const seleccionada = pagina.querySelector(
      '.mapa .mesas.seleccionada'
    );

    if (!seleccionada ||
        seleccionada.classList.contains('mesasOcupada')) {
      return;
    }

    const dialogo = pagina.querySelector('#dialog');

    dialogo.dataset.mesaId = seleccionada.dataset.id;

    pagina.querySelector('#mesaFormulario').textContent =
      `Mesa ${seleccionada.dataset.id}`;

    dialogo.showModal();
  }

  // CANCELAR
  if (event.target.id === 'cancelarDialog') {
    pagina.querySelector('#dialog').close();
  }

});
document.addEventListener('submit', (event) => {

  if (!event.target.matches(
    '.table-map-page #formAbrirMesa'
  )) return;

  event.preventDefault();

  const formulario = event.target;
  const pagina = formulario.closest('.table-map-page');
  const dialogo = pagina.querySelector('#dialog');

  const id = dialogo.dataset.mesaId;

  const mesa = Array.from(
    pagina.querySelectorAll('.mapa .mesas')
  ).find(boton => boton.dataset.id === id);

  const personas = Number(
    pagina.querySelector('#numeroPersonas').value
  );

  // Validar cantidad de personas
  if (!Number.isInteger(personas) || personas < 1) {
    alert('Ingresa una cantidad válida de personas');
    return;
  }

  // Validar que la mesa esté libre
  if (!mesa || mesa.classList.contains('mesasOcupada')) {
    alert('La mesa ya está ocupada');
    return;
  }

  // Registrar datos de apertura
  mesa.dataset.personas = String(personas);

  mesa.dataset.hora = new Date().toLocaleTimeString('es-CO');

  // Cambiar el estado visual
  mesa.classList.remove('mesasLibre');
  mesa.classList.add('mesasOcupada');

  // Actualizar la información del recuadro
  mostrarMesa(pagina, mesa);

  // Cerrar formulario
  dialogo.close();
  formulario.reset();

});
