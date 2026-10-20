# Capa de Infraestructura: Servicios CRUD de Base de Datos

Este módulo contiene la implementación de los servicios de acceso a datos y operaciones CRUD para cada una de las 10 entidades del modelo relacional de la base de datos de **Restaurante Avanzado**.

Todos los servicios extienden de `BaseService` y operan con consultas parametrizadas sobre PostgreSQL utilizando la conexión centralizada en `src/infrastructure/database/connection.js`.

---

## 📁 Estructura del Módulo

```
src/infrastructure/services/
├── BaseService.js               # Clase base con operaciones CRUD genéricas y soporte transaccional
├── MesaService.js               # CRUD y gestión de estados de 'mesa'
├── UsuarioService.js            # CRUD, contraseñas seguras y activación de 'usuario'
├── PlatoService.js              # CRUD, recetas y categorías de 'plato'
├── IngredienteService.js        # CRUD, control de stock atómico y alertas de 'ingrediente'
├── RecetaIngredienteService.js  # CRUD y composición de platos de 'receta_ingrediente'
├── CuentaService.js             # CRUD, cálculo de totales y cierre de 'cuenta'
├── DetalleCuentaService.js      # CRUD, comandas y pantalla KDS de 'detalle_cuenta'
├── PagoService.js               # CRUD, métodos de pago y validación de saldo de 'pago'
├── MovimientoInventarioService.js # CRUD, kardex y descuento automático de stock de 'movimiento_inventario'
├── NotificacionService.js       # CRUD y alertas de cocina / stock mínimo de 'notificacion'
├── index.js                     # Exportación unificada de clases, instancias y enums
└── README.md                    # Documentación de uso y ejemplos
```

---

## 🚀 Guía de Uso Rápido

### 1. Importación

Puedes importar tanto las instancias preconfiguradas (*singletons*) como las clases para instanciación personalizada o inyección de dependencias:

```javascript
// Opción A: Usar instancias por defecto
import {
  mesaService,
  cuentaService,
  detalleCuentaService,
  platoService,
  ingredienteService,
  movimientoInventarioService,
  pagoService,
  notificacionService,
  usuarioService,
  recetaIngredienteService
} from '../infrastructure/services/index.js';

// Opción B: Instanciar manualmente
import { MesaService } from '../infrastructure/services/MesaService.js';
const miMesaService = new MesaService();
```

---

## 🛠️ Métodos y Contratos por Servicio

### 1. `MesaService` (`mesa`)
- `create({ numero, capacidad, estado = 'Libre' }, client)`: Inserta una nueva mesa validando enums.
- `getAll({ estado }, client)`: Retorna lista de mesas ordenadas por número.
- `getById(id, client)`: Busca mesa por ID.
- `getByNumero(numero, client)`: Busca mesa por código/número.
- `update(id, data, client)`: Actualiza campos dinámicos.
- `updateEstado(id, nuevoEstado, client)`: Cambia el estado ('Libre', 'Ocupada', 'Reservada').
- `getMesasLibres(client)`: Obtiene mesas listas para asignar comensales.
- `delete(id, client)`: Elimina la mesa por ID.

### 2. `UsuarioService` (`usuario`)
- `create({ nombre, rol, credenciales_email, credenciales_password, activo = true }, client)`: Crea usuario y omite la contraseña en la respuesta por seguridad.
- `getAll({ rol, activo }, client)`: Lista usuarios sin exponer hashes de contraseña.
- `getById(id, includePassword = false, client)`: Busca usuario por ID.
- `getByEmail(email, includePassword = false, client)`: Busca usuario por correo electrónico.
- `update(id, data, client)`: Actualiza datos del usuario.
- `cambiarPassword(id, nuevaPasswordHash, client)`: Actualiza contraseña.
- `desactivar(id, client)` / `reactivar(id, client)`: Soft-delete por bandera `activo`.
- `delete(id, client)`: Borrado físico.

### 3. `PlatoService` (`plato`)
- `create({ nombre, precio, descripcion, categoria, activo = true }, client)`: Crea plato validando categoría.
- `getAll({ categoria, activo }, client)`: Lista platos activos o por categoría.
- `getById(id, client)`: Retorna plato por ID.
- `getByCategoria(categoria, soloActivos = true, client)`: Filtra por categoría ('Entradas', 'Platos Fuertes', etc.).
- `getReceta(id, client)`: Retorna los ingredientes necesarios y el stock disponible actual.
- `update(id, data, client)`: Modifica precios o datos del plato.
- `desactivar(id, client)` / `reactivar(id, client)`: Soft-delete.
- `delete(id, client)`: Borrado físico.

### 4. `IngredienteService` (`ingrediente`)
- `create({ nombre, unidad_medida, stock_actual, punto_reorden }, client)`: Registra nuevo insumo.
- `getAll(options, client)`: Lista todos los ingredientes.
- `getById(id, client)`: Busca insumo por ID.
- `update(id, data, client)`: Actualiza datos o umbrales.
- `getLowStock(client)`: Retorna insumos donde `stock_actual <= punto_reorden`.
- `actualizarStock(id, cantidadCambio, client)`: Modificación atómica (`stock_actual = stock_actual + delta`).
- `verificarDisponibilidad(id, cantidadRequerida, client)`: Comprueba si hay existencias suficientes.
- `delete(id, client)`: Borrado de insumo.

### 5. `RecetaIngredienteService` (`receta_ingrediente`)
- `create({ plato_id, ingrediente_id, cantidad_requerida }, client)`: Asocia ingrediente a plato.
- `getAll({ plato_id, ingrediente_id }, client)`: Lista relaciones con nombres y unidades.
- `getById(id, client)`: Obtiene relación por ID.
- `getByPlatoId(plato_id, client)`: Retorna la ficha técnica de insumos de un plato.
- `deleteByPlatoId(plato_id, client)`: Limpia los ingredientes de un plato.
- `guardarRecetaCompleta(plato_id, items)`: Reemplaza atómicamente en una transacción todos los insumos del plato.

### 6. `CuentaService` (`cuenta`)
- `create({ mesa_id, mesero_id, numero_comensales, estado, ... }, client)`: Apertura de comanda/cuenta.
- `getAll({ estado, mesa_id, mesero_id }, client)`: Listado con join a `mesa` y `usuario`.
- `getById(id, client)`: Obtiene cabecera de cuenta.
- `getByMesaId(mesa_id, soloAbiertas = true, client)`: Encuentra la cuenta activa de una mesa.
- `updateEstado(id, nuevoEstado, fecha_cierre, client)`: Gestiona estados ('Abierta', 'Pagada', 'Cerrada').
- `recalcularTotales(id, porcentajeImpuesto = 0, client)`: Calcula subtotal = sum(platos * cantidad) no cancelados, impuestos y total.
- `cerrarCuenta(id)`: Transaccional: actualiza cuenta a 'Cerrada' con timestamp y libera la mesa (`mesa.estado = 'Libre'`).
- `getCuentaCompleta(id, client)`: Devuelve cabecera + líneas de detalle + historial de pagos.

### 7. `DetalleCuentaService` (`detalle_cuenta`)
- `create({ cuenta_id, plato_id, cantidad, notas, estado, ... }, client)`: Agrega pedido a la cuenta.
- `getAll({ cuenta_id, plato_id, estado }, client)`: Lista pedidos con datos de plato y total línea.
- `getById(id, client)`: Detalle individual.
- `getByCuentaId(cuenta_id, client)`: Todas las líneas de una cuenta.
- `updateEstado(id, nuevoEstado, client)`: Actualiza estado de preparación en cocina.
- `getKdsItems(estados, client)`: Consulta especializada para la pantalla de cocina (KDS) con mesa y mesero.
- `delete(id, client)`: Elimina línea de pedido.

### 8. `PagoService` (`pago`)
- `create({ cuenta_id, metodo_pago, monto, fecha_pago }, client)`: Inserta comprobante de pago.
- `getAll({ cuenta_id, metodo_pago }, client)`: Historial de transacciones con total de cuenta y mesa.
- `getById(id, client)`: Consulta pago individual.
- `getByCuentaId(cuenta_id, client)`: Pagos aplicados a una cuenta.
- `getTotalPagadoPorCuenta(cuenta_id, client)`: Sumatoria de abonos realizados.
- `registrarPagoConValidacion({ cuenta_id, metodo_pago, monto })`: Transaccional: registra el abono y si cubre el total, actualiza la cuenta a 'Pagada'.
- `delete(id, client)`: Anula/elimina un registro de pago.

### 9. `MovimientoInventarioService` (`movimiento_inventario`)
- `create({ ingrediente_id, tipo_movimiento, cantidad, cuenta_id }, client)`: Registra movimiento en el kardex.
- `getAll({ ingrediente_id, tipo_movimiento, cuenta_id }, client)`: Consulta movimientos con datos de insumo.
- `getById(id, client)`: Movimiento individual.
- `registrarMovimientoConAjusteStock({ ingrediente_id, tipo_movimiento, cantidad, cuenta_id })`: Transaccional: registra el movimiento y ajusta `stock_actual` (suma en 'Ingreso', resta en 'Deducción' y 'Merma').
- `descontarStockPorPlato(plato_id, cantidadPlatos, cuenta_id)`: Descuenta automáticamente todos los insumos de la receta de un plato vendido.

### 10. `NotificacionService` (`notificacion`)
- `create({ tipo, mensaje, estado, usuario_destino_id }, client)`: Crea notificación en sistema.
- `getAll({ usuario_destino_id, estado, tipo }, client)`: Listado con nombre y rol de destinatario.
- `getById(id, client)`: Notificación individual.
- `getByUsuarioId(usuario_destino_id, soloNoLeidas = false, client)`: Bandeja de mensajes del usuario.
- `marcarComoLeida(id, client)`: Transiciona a 'Leída'.
- `marcarComoEntregada(id, client)`: Transiciona a 'Entregada'.
- `crearAlertaStockMinimo(ingredienteNombre, stockActual, puntoReorden, usuarioDestinoId)`: Genera alerta de inventario.
- `crearNotificacionPlatilloListo(platoNombre, mesaNumero, meseroId)`: Alerta al mesero que el pedido está listo para servir.

---

## 🔒 Manejo de Transacciones

Para operaciones complejas que involucren varias tablas (por ejemplo, descontar inventario y abrir cuenta), cualquier servicio expone el método `transaction`:

```javascript
import { cuentaService, detalleCuentaService, mesaService } from './index.js';

await cuentaService.transaction(async (client) => {
  // 1. Ocupar mesa
  await mesaService.updateEstado(1, 'Ocupada', client);

  // 2. Crear cuenta
  const cuenta = await cuentaService.create({
    mesa_id: 1,
    numero_comensales: 4,
    mesero_id: 2
  }, client);

  // 3. Agregar primer detalle
  await detalleCuentaService.create({
    cuenta_id: cuenta.id,
    plato_id: 5,
    cantidad: 2
  }, client);
});
```
