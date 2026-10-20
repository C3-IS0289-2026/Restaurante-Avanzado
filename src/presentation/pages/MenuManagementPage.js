export class MenuManagementPage {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'menu-management-page';
  }

  render() {
    this.container.innerHTML = `
      <h1>Gestión de Menú</h1>

      <div class="management-layout">
        <div class="list-section" id="dishListContainer">
          <!-- DishList renderizará aquí -->
          
          <h1>PLATOS<h1/>
           
          <h2>plato1<h2/> 
          
          <table style="border: 2px; border-style: dashed; border-color: blue;">
           <tr style="border: 2px; border-style: dashed; border-color: red;>
             <td style="border: 2px; border-style: dashed; border-color: yellow;>contenido del plato<td/>
             <td style="border: 2px; border-style: dashed; border-color: green;>precio<td/>
             
             <tr/>
             <table/>
          
          <h2>plato2<h2/>
          <P>este plato contin<p/>
          <h2>plato3<h2/>
          <P>este plato contin</p>
          <h2>plato4<h2/>
          <P>este plato contin</p>
          <h2>plato5<h2/>
          <P>este plato contin</p>
          

        
         

        </div>
        <div class="form-section" id="dishFormContainer">
          <!-- DishForm renderizará aquí -->
          <h1>BEBIDAS<h1/>

          <h2>bebida1<h2/>
          <h2>bebida2<h2/>
          <h2>bebida3<h2/>
          <h2>bebida4<h2/>
          <h2>bebida5<h2/>



        </div>
      </div>
    `;
    return this.container;
  }
}
