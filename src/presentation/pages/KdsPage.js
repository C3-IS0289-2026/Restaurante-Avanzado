export class KdsPage {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'kds-page';
  }

  render() {
    this.container.innerHTML = `
      <header>
        <h1>Pantalla de Cocina (KDS)</h1>
      </header>
      <div id="kdsBoardContainer">
        <!-- KdsBoard renderizará aquí -->
         <h1>Toma de Pedidos</h1>
        <div class="dishes-grid" id="dishesGrid">
          <!-- DishCard(s) renderizarán aquí -->
        </div>
        <h2>Gestión de Menú</h2>
        <h2 id = "tile">platillo entrante <h2/>
        </title>
        <h3> hora de entrada </h2>
        <h4> hora de salida del platillo </h4>
        <span style="margin-left: 20px;">platillo a la hora de salida </span>
        <span style="margin-right: 15px;">platillo 1</span>
<span>platillo 2</span>
<div class="contenedor-principal">
  <div class="parte parte-izquierda">
    <h2>platillo 1</h2>
    <p>Contenido del platillo.</p>
  </div>
  <div class="parte parte-derecha">
    <h2>platillo 2 contnido del platillo</h2>
    <p>siguient platillo por salir.</p>
    
  </div>
</div>

<

      </div>

    `;
    return this.container;
  }
}
