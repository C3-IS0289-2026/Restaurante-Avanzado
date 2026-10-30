# Glosario y Estándar de Lenguaje Ubicuo (DDD)

**Proyecto:** Restaurante Avanzado  
**Asignatura:** IS0289 - Programación Avanzada  

---

## 1. Propósito

En **Domain-Driven Design (DDD)**, el **Lenguaje Ubicuo (*Ubiquitous Language*)** establece un vocabulario común, riguroso y compartido entre los expertos del negocio, el equipo de desarrollo, la documentación funcional, el código fuente (Dominio, Aplicación, Infraestructura, Presentación) y el esquema físico de la base de datos.

Este documento formaliza la corrección de la inconsistencia terminológica detectada en versiones previas de la base de datos:
- `comanda` $\Rightarrow$ **`cuenta`**
- `estado_comanda` $\Rightarrow$ **`estado_cuenta`**
- `detalle_comanda` $\Rightarrow$ **`detalle_cuenta`**
- `estado_detalle_comanda` $\Rightarrow$ **`estado_detalle_cuenta`**
- `platillo` / `categoria_platillo` $\Rightarrow$ **`plato`** / **`categoria_plato`**

---

## 2. Definición de las Entidades Refactorizadas

### 2.1. Entidad `cuenta` (antes `comanda`)

- **Significado en el Dominio:** Representa el expediente financiero y de servicio asociado a una **Mesa** desde el momento en que los clientes son ubicados (`fecha_apertura`) hasta que se liquida el pago y se libera la mesa (`fecha_cierre`).
- **Razón del cambio (`comanda` $\Rightarrow$ `cuenta`):** En la operación gastronómica, una mesa tiene una única **Cuenta** abierta por servicio sobre la cual se realizan múltiples envíos de pedidos a cocina y uno o varios pagos parciales o totales. Llamar `comanda` a la entidad cabecera generaba confusión entre el documento de cobro de la mesa y las solicitudes enviadas a cocina.
- **Enumerador asociado (`estado_cuenta`):**
  - `'Abierta'`: Estado inicial al abrir la mesa. Permite agregar nuevos registros en `detalle_cuenta`.
  - `'Pagada'`: Los pagos registrados en `pago` cubren el monto `total` de la cuenta.
  - `'Cerrada'`: Estado terminal tras finalizar el servicio, registrar `fecha_cierre` y liberar la `mesa` a estado `'Libre'`.

#### Estructura en Base de Datos (`public.cuenta`)
| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `integer` (`SERIAL`) | `PRIMARY KEY` (`cuenta_pkey`), secuencia `cuenta_id_seq` | Identificador único de la cuenta. |
| `mesa_id` | `integer` | `NOT NULL`, `REFERENCES mesa(id) ON DELETE RESTRICT` (`cuenta_mesa_id_fkey`) | Mesa en la que se presta el servicio. |
| `mesero_id` | `integer` | `REFERENCES usuario(id) ON DELETE SET NULL` (`cuenta_mesero_id_fkey`) | Mesero responsable de la atención. |
| `numero_comensales` | `integer` | `NOT NULL` (> 0) | Cantidad de clientes en la mesa. |
| `estado` | `estado_cuenta` | `NOT NULL DEFAULT 'Abierta'` | Estado actual del ciclo de vida de la cuenta. |
| `subtotal` | `numeric(10,2)` | `NOT NULL DEFAULT 0.00` | Suma de `(cantidad * precio)` de los detalles no cancelados. |
| `impuestos` | `numeric(10,2)` | `NOT NULL DEFAULT 0.00` | Impuestos calculados sobre el subtotal. |
| `total` | `numeric(10,2)` | `NOT NULL DEFAULT 0.00` | Monto total a pagar (`subtotal + impuestos`). |
| `fecha_apertura` | `timestamp` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de apertura de la cuenta. |
| `fecha_cierre` | `timestamp` | `NULL` | Fecha y hora de cierre definitivo de la cuenta. |

---

### 2.2. Entidad `detalle_cuenta` y Enumerador `estado_detalle_cuenta` (antes `detalle_comanda` y `estado_detalle_comanda`)

- **Significado en el Dominio:** Representa cada **Línea de Pedido / Solicitud de Cocina** vinculada a una `cuenta`. Especifica qué `plato` se ordenó, en qué `cantidad`, con qué `notas` o modificadores, a qué hora se solicitó (`hora_envio`) y en qué etapa de preparación se encuentra (`estado`).
- **Razón del cambio (`estado_detalle_comanda` $\Rightarrow$ `estado_detalle_cuenta`):** Mantiene coherencia estructural y semántica con la entidad padre `cuenta` y la tabla `detalle_cuenta`. En la capa de Dominio se modela mediante la entidad `Solicitud` (alias `DetalleCuenta`) y el Value Object `EstadoSolicitud` (alias `EstadoDetalleCuenta`).
- **Enumerador asociado (`estado_detalle_cuenta`):**
  - `'Enviado a Cocina'`: Estado inicial cuando el mesero confirma el pedido y aparece en la columna de recibidos del KDS.
  - `'En Preparación'`: El cocinero inicia la elaboración del plato.
  - `'Listo para Servir'`: El plato está terminado en barra de cocina y dispara una notificación (`'Platillo Listo'`) al mesero.
  - `'Entregado'`: Estado terminal exitoso cuando el mesero entrega el plato en la mesa.
  - `'Cancelado'`: Estado terminal de anulación (excluido del cálculo de totales de la cuenta).

#### Estructura en Base de Datos (`public.detalle_cuenta`)
| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `integer` (`SERIAL`) | `PRIMARY KEY` (`detalle_cuenta_pkey`), secuencia `detalle_cuenta_id_seq` | Identificador único del detalle de cuenta. |
| `cuenta_id` | `integer` | `NOT NULL`, `REFERENCES cuenta(id) ON DELETE CASCADE` (`detalle_cuenta_cuenta_id_fkey`) | Cuenta a la que pertenece este ítem. |
| `plato_id` | `integer` | `NOT NULL`, `REFERENCES plato(id) ON DELETE RESTRICT` (`detalle_cuenta_plato_id_fkey`) | Plato del menú solicitado. |
| `cantidad` | `integer` | `NOT NULL` (> 0) | Número de unidades solicitadas. |
| `notas` | `text` | `NULL` | Instrucciones especiales o motivo de cancelación. |
| `estado` | `estado_detalle_cuenta` | `NOT NULL DEFAULT 'Enviado a Cocina'` | Estado de preparación en el flujo KDS. |
| `hora_envio` | `timestamp` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Marca de tiempo de envío a cocina (orden FIFO en KDS). |

---

## 3. Matriz Completa de Consistencia del Esquema Relacional

| Entidad (Tabla) | Enumeradores Usados | Secuencia | Llave Primaria (PK) | Llaves Foráneas (FK) |
| :--- | :--- | :--- | :--- | :--- |
| `mesa` | `estado_mesa` | `mesa_id_seq` | `mesa_pkey` | — |
| `usuario` | `rol_usuario` | `usuario_id_seq` | `usuario_pkey` | — |
| `plato` | `categoria_plato` | `plato_id_seq` | `plato_pkey` | — |
| `ingrediente` | — | `ingrediente_id_seq` | `ingrediente_pkey` | — |
| `receta_ingrediente` | — | `receta_ingrediente_id_seq` | `receta_ingrediente_pkey` | `receta_ingrediente_plato_id_fkey` (`plato_id` $\to$ `plato.id`)<br>`receta_ingrediente_ingrediente_id_fkey` (`ingrediente_id` $\to$ `ingrediente.id`) |
| **`cuenta`** | **`estado_cuenta`** | **`cuenta_id_seq`** | **`cuenta_pkey`** | **`cuenta_mesa_id_fkey`** (`mesa_id` $\to$ `mesa.id`)<br>**`cuenta_mesero_id_fkey`** (`mesero_id` $\to$ `usuario.id`) |
| **`detalle_cuenta`** | **`estado_detalle_cuenta`** | **`detalle_cuenta_id_seq`** | **`detalle_cuenta_pkey`** | **`detalle_cuenta_cuenta_id_fkey`** (`cuenta_id` $\to$ `cuenta.id`)<br>**`detalle_cuenta_plato_id_fkey`** (`plato_id` $\to$ `plato.id`) |
| `pago` | `metodo_pago` | `pago_id_seq` | `pago_pkey` | **`pago_cuenta_id_fkey`** (`cuenta_id` $\to$ `cuenta.id`) |
| `movimiento_inventario` | `tipo_movimiento` | `movimiento_inventario_id_seq` | `movimiento_inventario_pkey` | `movimiento_inventario_ingrediente_id_fkey` (`ingrediente_id` $\to$ `ingrediente.id`)<br>**`movimiento_inventario_cuenta_id_fkey`** (`cuenta_id` $\to$ `cuenta.id`) |
| `notificacion` | `tipo_notificacion`, `estado_notificacion` | `notificacion_id_seq` | `notificacion_pkey` | `notificacion_usuario_destino_id_fkey` (`usuario_destino_id` $\to$ `usuario.id`) |
