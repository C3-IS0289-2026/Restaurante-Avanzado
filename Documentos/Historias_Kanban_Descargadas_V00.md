# Historias de Usuario (Descargadas de Kanban Github)

## HU-008: Gestión de Menú (CRUD) (Asignado a @David3560) (#30)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/30

### Descripción
Como **Administrador**,
Quiero **crear, editar, leer y eliminar platillos del menú**,
Para **mantener la oferta gastronómica y precios del restaurante actualizados**.

**Criterios de aceptación:**
1. El sistema debe tener un formulario para crear nuevos platillos indicando nombre, precio, descripción y categoría.
2. Se debe permitir actualizar el precio o detalles de un platillo existente.
3. Se debe permitir eliminar o desactivar (soft delete) un platillo para que ya no aparezca en las opciones del mesero.
4. Todos los cambios en el menú deben reflejarse inmediatamente en la interfaz de "Toma de Pedidos" de los meseros.


**Estudiante asignado:** @David3560
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-007: Notificación de Platillo Listo (Asignado a @David3560) (#29)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/29

### Descripción
Como **Mesero**,
Quiero **recibir una alerta cuando la comida de mis mesas esté "Lista para Servir"**,
Para **recoger los platillos de la cocina y entregarlos calientes a los clientes**.

**Criterios de aceptación:**
1. La interfaz del mesero debe mostrar una notificación visual cuando una de sus mesas cambie a "Listo para Servir".
2. La notificación debe incluir el número de mesa y los platillos listos.
3. El mesero debe poder descartar o marcar como "Entregado" el platillo desde la notificación o vista de mesa.
4. El estado final de la orden en el sistema debe actualizarse a "Entregada" una vez que el mesero la confirme.


**Estudiante asignado:** @David3560
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-001: Visualización del Mapa de Mesas (Asignado a @DouCiv) (#1)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/1

### Descripción
Como **Mesero**,
Quiero **ver un mapa visual del restaurante con el estado actual de cada mesa (Libre, Ocupada, Reservada)**,
Para **saber de forma rápida dónde puedo ubicar a los nuevos clientes que van llegando**.

**Criterios de aceptación:**
1. El mapa debe mostrar todas las mesas registradas en el sistema.
2. Cada mesa debe indicar su estado actual usando colores (ej. verde para libre, rojo para ocupada, amarillo para reservada).
3. La vista del mapa debe actualizarse en tiempo real o al recargar la página.
4. Al hacer clic en una mesa, se debe mostrar un resumen de su estado y número máximo de comensales.


**Estudiante asignado:** @DouCiv
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-006: Actualización de Estado de Preparación (Asignado a @DiaxJF) (#6)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/6

### Descripción
Como **Cocinero**,
Quiero **cambiar el estado de los platillos a "En Preparación" y luego a "Listo para Servir"**,
Para **notificar al salón que la orden avanza o ya puede ser recogida**.

**Criterios de aceptación:**
1. El sistema debe permitir marcar un ítem o una comanda entera como "En Preparación" con un solo clic.
2. El sistema debe permitir marcar un ítem o comanda entera como "Listo para Servir".
3. Los cambios de estado deben reflejarse de inmediato en la pantalla KDS.
4. Un platillo marcado como "Listo para Servir" no puede volver a "En Preparación" a menos que sea cancelado y reordenado.


**Estudiante asignado:** @DiaxJF
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-002: Apertura de Mesa (Asignado a @DouCiv) (#2)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/2

### Descripción
Como **Mesero**,
Quiero **seleccionar una mesa libre y abrir una nueva cuenta indicando el número de comensales**,
Para **comenzar a tomar el pedido de los clientes y registrar su consumo**.

**Criterios de aceptación:**
1. Solo se pueden abrir cuentas en mesas que estén en estado "Libre".
2. Al abrir la mesa, el sistema debe solicitar y registrar el número de comensales.
3. El estado de la mesa debe cambiar automáticamente de "Libre" a "Ocupada" tras abrir la cuenta.
4. Se debe crear una comanda (orden) vacía asociada a la mesa recién abierta.


**Estudiante asignado:** @DouCiv
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-003: Toma de Pedidos (Comanda) (Asignado a @DouCiv) (#3)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/3

### Descripción
Como **Mesero**,
Quiero **agregar platillos del menú a la cuenta de una mesa abierta**,
Para **poder enviar la orden a cocina y registrar el consumo de los clientes**.

**Criterios de aceptación:**
1. El mesero debe poder ver una lista categorizada de platillos disponibles.
2. Cada platillo agregado debe reflejarse inmediatamente en el resumen de la comanda de la mesa.
3. Se debe permitir modificar la cantidad de un platillo antes de enviar la orden a cocina.
4. Al confirmar el pedido, el estado de los ítems debe cambiar a "Enviado a Cocina" (o estado inicial equivalente).


**Estudiante asignado:** @DouCiv
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-009: Receta de Platillos (Asignado a @juan4298jose) (#20)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/20

### Descripción
Como **Administrador**,
Quiero **asociar una receta con ingredientes y cantidades específicas a cada platillo**,
Para **vincular correctamente las ventas con el control de inventario**.

**Criterios de aceptación:**
1. Al editar o crear un platillo, se debe poder agregar múltiples ingredientes a su receta.
2. Para cada ingrediente de la receta, se debe especificar la cantidad y la unidad de medida (ej. gramos, mililitros).
3. El sistema debe validar que los ingredientes agregados a la receta existan previamente en el módulo de inventario.
4. Se debe permitir modificar o eliminar ingredientes de una receta existente sin afectar ventas pasadas.


**Estudiante asignado:** @juan4298jose
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-005: Pantalla de Recepción de Comandas (KDS) (Asignado a @David3560) (#27)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/27

### Descripción
Como **Cocinero**,
Quiero **ver una pantalla con las órdenes entrantes organizadas por tiempo de llegada**,
Para **saber qué platillos debo preparar a continuación y optimizar los tiempos**.

**Criterios de aceptación:**
1. La pantalla debe mostrar las comandas recién enviadas por los meseros de forma automática.
2. Las órdenes deben estar ordenadas cronológicamente, mostrando la más antigua primero.
3. Cada orden debe detallar claramente el número de mesa, los platillos y las cantidades requeridas.
4. Las órdenes que superen el tiempo límite de preparación esperado deben resaltarse visualmente.


**Estudiante asignado:** @David3560
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-004: Cierre de Cuenta y Pago (Asignado a @DouCiv) (#4)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/4

### Descripción
Como **Cajero**,
Quiero **visualizar el total consumido por una mesa y procesar su pago**,
Para **cobrar correctamente a los clientes y liberar la mesa para nuevos comensales**.

**Criterios de aceptación:**
1. El sistema debe calcular y mostrar el subtotal, impuestos y total exacto a pagar basado en la comanda.
2. Se debe permitir procesar el pago registrando el método utilizado (Efectivo o Tarjeta).
3. Al completar el pago, la comanda debe cambiar a estado "Pagada" o "Cerrada".
4. El estado de la mesa debe cambiar automáticamente a "Libre" una vez procesado exitosamente el pago.


**Estudiante asignado:** @DouCiv
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-005: Pantalla de Recepción de Comandas (KDS) (Asignado a @DouCiv) (#5)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/5

### Descripción
Como **Cocinero**,
Quiero **ver una pantalla con las órdenes entrantes organizadas por tiempo de llegada**,
Para **saber qué platillos debo preparar a continuación y optimizar los tiempos**.

**Criterios de aceptación:**
1. La pantalla debe mostrar las comandas recién enviadas por los meseros de forma automática.
2. Las órdenes deben estar ordenadas cronológicamente, mostrando la más antigua primero.
3. Cada orden debe detallar claramente el número de mesa, los platillos y las cantidades requeridas.
4. Las órdenes que superen el tiempo límite de preparación esperado deben resaltarse visualmente.


**Estudiante asignado:** @DouCiv
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-011: Alerta de Stock Mínimo (Asignado a @juanpaocampo45) (#11)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/11

### Descripción
Como **Administrador**,
Quiero **ver una alerta visual cuando un ingrediente caiga por debajo de su punto de reorden**,
Para **realizar las compras con tiempo y evitar quedarnos sin insumos**.

**Criterios de aceptación:**
1. Cada ingrediente en el inventario debe permitir configurar un valor numérico como "punto de reorden" (stock mínimo).
2. El sistema debe evaluar el stock después de cada deducción y comparar con el punto de reorden.
3. Si el stock actual es menor o igual al punto de reorden, se debe mostrar una alerta en el dashboard del administrador.
4. La alerta debe desaparecer automáticamente cuando se ingrese nuevo stock al inventario que supere el mínimo.


**Estudiante asignado:** @juanpaocampo45
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-004: Cierre de Cuenta y Pago (Asignado a @David3560) (#26)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/26

### Descripción
Como **Cajero**,
Quiero **visualizar el total consumido por una mesa y procesar su pago**,
Para **cobrar correctamente a los clientes y liberar la mesa para nuevos comensales**.

**Criterios de aceptación:**
1. El sistema debe calcular y mostrar el subtotal, impuestos y total exacto a pagar basado en la comanda.
2. Se debe permitir procesar el pago registrando el método utilizado (Efectivo o Tarjeta).
3. Al completar el pago, la comanda debe cambiar a estado "Pagada" o "Cerrada".
4. El estado de la mesa debe cambiar automáticamente a "Libre" una vez procesado exitosamente el pago.


**Estudiante asignado:** @David3560
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-001: Visualización del Mapa de Mesas (Asignado a @juanpaocampo45) (#12)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/12

### Descripción
Como **Mesero**,
Quiero **ver un mapa visual del restaurante con el estado actual de cada mesa (Libre, Ocupada, Reservada)**,
Para **saber de forma rápida dónde puedo ubicar a los nuevos clientes que van llegando**.

**Criterios de aceptación:**
1. El mapa debe mostrar todas las mesas registradas en el sistema.
2. Cada mesa debe indicar su estado actual usando colores (ej. verde para libre, rojo para ocupada, amarillo para reservada).
3. La vista del mapa debe actualizarse en tiempo real o al recargar la página.
4. Al hacer clic en una mesa, se debe mostrar un resumen de su estado y número máximo de comensales.


**Estudiante asignado:** @juanpaocampo45
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-005: Pantalla de Recepción de Comandas (KDS) (Asignado a @juan4298jose) (#16)
**Estado en GitHub:** CLOSED | **Columna Kanban:** Done
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/16

### Descripción
Como **Cocinero**,
Quiero **ver una pantalla con las órdenes entrantes organizadas por tiempo de llegada**,
Para **saber qué platillos debo preparar a continuación y optimizar los tiempos**.

**Criterios de aceptación:**
1. La pantalla debe mostrar las comandas recién enviadas por los meseros de forma automática.
2. Las órdenes deben estar ordenadas cronológicamente, mostrando la más antigua primero.
3. Cada orden debe detallar claramente el número de mesa, los platillos y las cantidades requeridas.
4. Las órdenes que superen el tiempo límite de preparación esperado deben resaltarse visualmente.


**Estudiante asignado:** @juan4298jose
*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*.


---

## HU-005.4: Ordenar tickets por tiempo de espera (Asignado a @juanpaocampo45) (#70)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/70

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-006.1: Botones para cambiar estado a "En Preparación" y "Listo" (Asignado a @juanpaocampo45) (#71)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/71

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-006.2: Lógica backend para actualizar estado de la comanda (Asignado a @juanpaocampo45) (#72)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/72

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-006.3: Reflejar cambio de estado en pantalla KDS en tiempo real (Asignado a @juanpaocampo45) (#73)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/73

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-006.4: Validaciones para evitar cambios de estado inválidos (Asignado a @juanpaocampo45) (#74)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/74

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-007.1: Sistema base para emitir notificaciones push/web al mesero (Asignado a @juan4298jose) (#75)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/75

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-007.2: UI de notificaciones no leídas en la app del mesero (Asignado a @juan4298jose) (#76)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/76

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-007.3: Acción para marcar notificación como leída o entregada (Asignado a @juan4298jose) (#77)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/77

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-007.4: Integración de notificaciones con la vista de mesas (Asignado a @juan4298jose) (#78)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/78

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-008.1: Formulario para crear un nuevo platillo con sus campos básicos (Asignado a @juan4298jose) (#79)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/79

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-008.2: Vista de listado de platillos con búsqueda y filtros (Asignado a @juan4298jose) (#80)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/80

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-008.3: Función para editar precio y descripción de un platillo (Asignado a @juan4298jose) (#81)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/81

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-008.4: Implementar borrado lógico (soft delete) de platillos (Asignado a @juan4298jose) (#82)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/82

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-009.1: Definir estructura de datos de receta e ingredientes (Asignado a @Bree-zzz) (#83)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/83

### Descripción
Tarea atomizada de la historia original: HU-009: Receta de Platillos

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-009.2: Interfaz para agregar ingredientes a un platillo (Asignado a @Bree-zzz) (#84)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/84

### Descripción
Tarea atomizada de la historia original: HU-009: Receta de Platillos

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-009.3: Vista de lectura de recetas para el personal de cocina (Asignado a @Bree-zzz) (#85)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/85

### Descripción
Tarea atomizada de la historia original: HU-009: Receta de Platillos

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-009.4: Control de porciones y cálculo de costo teórico (Asignado a @Bree-zzz) (#86)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/86

### Descripción
Tarea atomizada de la historia original: HU-009: Receta de Platillos

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-010.1: Lógica para enlazar comanda con ingredientes de receta (Asignado a @Bree-zzz) (#87)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/87

### Descripción
Tarea atomizada de la historia original: HU-010: Descuento Automático de Inventario

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-010.2: Reducción automática de stock tras confirmación de pedido (Asignado a @Bree-zzz) (#88)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/88

### Descripción
Tarea atomizada de la historia original: HU-010: Descuento Automático de Inventario

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-010.3: Manejo de errores cuando no hay suficiente stock (Asignado a @Bree-zzz) (#89)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/89

### Descripción
Tarea atomizada de la historia original: HU-010: Descuento Automático de Inventario

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-010.4: Registro histórico de movimientos de inventario por ventas (Asignado a @Bree-zzz) (#90)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/90

### Descripción
Tarea atomizada de la historia original: HU-010: Descuento Automático de Inventario

**Asignado a:** @Bree-zzz

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-011.1: Definir campo de "Stock mínimo" en gestión de ingredientes (Asignado a @David3560) (#91)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/91

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-011.2: Tarea programada o trigger que evalúa inventario tras descuentos (Asignado a @David3560) (#92)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/92

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-011.3: UI de dashboard para productos en alerta de stock (Asignado a @David3560) (#93)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/93

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-011.4: Notificación a gerente/compras de stock bajo (Asignado a @David3560) (#94)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/94

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-006.3: Reflejar cambio de estado en pantalla KDS en tiempo real (Asignado a @juanpaocampo45) (#45)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/45

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-006.4: Validaciones para evitar cambios de estado inválidos (Asignado a @juanpaocampo45) (#46)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/46

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-007.1: Sistema base para emitir notificaciones push/web al mesero (Asignado a @juan4298jose) (#47)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/47

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-007.2: UI de notificaciones no leídas en la app del mesero (Asignado a @juan4298jose) (#48)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/48

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-007.3: Acción para marcar notificación como leída o entregada (Asignado a @juan4298jose) (#49)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/49

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-007.4: Integración de notificaciones con la vista de mesas (Asignado a @juan4298jose) (#50)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/50

### Descripción
Tarea atomizada de la historia original: HU-007: Notificación de Platillo Listo

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-008.1: Formulario para crear un nuevo platillo con sus campos básicos (Asignado a @juan4298jose) (#51)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/51

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-008.2: Vista de listado de platillos con búsqueda y filtros (Asignado a @juan4298jose) (#52)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/52

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-008.3: Función para editar precio y descripción de un platillo (Asignado a @juan4298jose) (#53)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/53

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-008.4: Implementar borrado lógico (soft delete) de platillos (Asignado a @juan4298jose) (#54)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/54

### Descripción
Tarea atomizada de la historia original: HU-008: Gestión de Menú (CRUD)

**Asignado a:** @juan4298jose

Detalles técnicos a implementar durante el sprint.

---

## HU-011.1: Definir campo de "Stock mínimo" en gestión de ingredientes (Asignado a @David3560) (#55)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/55

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

---

## HU-011.2: Tarea programada o trigger que evalúa inventario tras descuentos (Asignado a @David3560) (#56)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/56

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

---

## HU-011.3: UI de dashboard para productos en alerta de stock (Asignado a @David3560) (#57)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/57

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

---

## HU-011.4: Notificación a gerente/compras de stock bajo (Asignado a @David3560) (#58)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/58

### Descripción
Tarea atomizada de la historia original: HU-011: Alerta de Stock Mínimo

**Asignado a:** @David3560

Detalles técnicos a implementar durante el sprint.

---

## HU-003.1: Interfaz para seleccionar platillos del menú por categorías (Asignado a @DiaxJF) (#59)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/59

### Descripción
Tarea atomizada de la historia original: HU-003: Toma de Pedidos (Comanda)

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-003.2: Lógica de carrito de compras (agregar/quitar platillos) (Asignado a @DiaxJF) (#60)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/60

### Descripción
Tarea atomizada de la historia original: HU-003: Toma de Pedidos (Comanda)

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-003.3: Capacidad para agregar notas o modificaciones a platillos (Asignado a @DiaxJF) (#61)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/61

### Descripción
Tarea atomizada de la historia original: HU-003: Toma de Pedidos (Comanda)

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-003.4: Envío de la comanda al backend y KDS (Asignado a @DiaxJF) (#62)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/62

### Descripción
Tarea atomizada de la historia original: HU-003: Toma de Pedidos (Comanda)

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-004.1: Mostrar resumen de la cuenta (subtotal, impuestos, total) (Asignado a @DiaxJF) (#63)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/63

### Descripción
Tarea atomizada de la historia original: HU-004: Cierre de Cuenta y Pago

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-004.2: Opciones de división de cuenta (por persona o items) (Asignado a @DiaxJF) (#64)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/64

### Descripción
Tarea atomizada de la historia original: HU-004: Cierre de Cuenta y Pago

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-004.3: Registro de método de pago (Efectivo, Tarjeta, etc.) (Asignado a @DiaxJF) (#65)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/65

### Descripción
Tarea atomizada de la historia original: HU-004: Cierre de Cuenta y Pago

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-004.4: Lógica de liberación de la mesa tras pago exitoso (Asignado a @DiaxJF) (#66)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/66

### Descripción
Tarea atomizada de la historia original: HU-004: Cierre de Cuenta y Pago

**Asignado a:** @DiaxJF

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-005.1: Estructura de la vista KDS (Columnas por estado) (Asignado a @juanpaocampo45) (#67)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/67

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-005.2: Recepción en tiempo real de nuevas comandas (Asignado a @juanpaocampo45) (#68)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/68

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-005.3: Mostrar detalles del pedido y notas del cliente (Asignado a @juanpaocampo45) (#69)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/69

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa en Github)*.

---

## HU-001.1: Crear la estructura base del mapa de mesas (UI estática) (Asignado a @DouCiv) (#31)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/31

### Descripción
Tarea atomizada de la historia original: HU-001: Visualización del Mapa de Mesas

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-001.2: Conectar mapa de mesas con el backend para estado en tiempo real (Asignado a @DouCiv) (#32)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/32

### Descripción
Tarea atomizada de la historia original: HU-001: Visualización del Mapa de Mesas

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-001.3: Diferenciar colores de mesas por estado (Libre, Ocupada) (Asignado a @DouCiv) (#33)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/33

### Descripción
Tarea atomizada de la historia original: HU-001: Visualización del Mapa de Mesas

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-001.4: Refinar diseño responsivo del mapa de mesas (Asignado a @DouCiv) (#34)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/34

### Descripción
Tarea atomizada de la historia original: HU-001: Visualización del Mapa de Mesas

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-002.1: Diseño del formulario de apertura de mesa (número de personas) (Asignado a @DouCiv) (#35)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/35

### Descripción
Tarea atomizada de la historia original: HU-002: Apertura de Mesa

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-002.2: Lógica para registrar hora de apertura y asignar mesero (Asignado a @DouCiv) (#36)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/36

### Descripción
Tarea atomizada de la historia original: HU-002: Apertura de Mesa

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-002.3: Validación de mesa ya ocupada (Asignado a @DouCiv) (#37)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/37

### Descripción
Tarea atomizada de la historia original: HU-002: Apertura de Mesa

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-002.4: Integración del cambio de estado en el mapa de mesas al abrir (Asignado a @DouCiv) (#38)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/38

### Descripción
Tarea atomizada de la historia original: HU-002: Apertura de Mesa

**Asignado a:** @DouCiv

Detalles técnicos a implementar durante el sprint.

---

## HU-005.1: Estructura de la vista KDS (Columnas por estado) (Asignado a @juanpaocampo45) (#39)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/39

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-005.2: Recepción en tiempo real de nuevas comandas (Asignado a @juanpaocampo45) (#40)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/40

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-005.3: Mostrar detalles del pedido y notas del cliente (Asignado a @juanpaocampo45) (#41)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/41

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-005.4: Ordenar tickets por tiempo de espera (Asignado a @juanpaocampo45) (#42)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/42

### Descripción
Tarea atomizada de la historia original: HU-005: Pantalla de Recepción de Comandas (KDS)

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-006.1: Botones para cambiar estado a "En Preparación" y "Listo" (Asignado a @juanpaocampo45) (#43)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/43

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

## HU-006.2: Lógica backend para actualizar estado de la comanda (Asignado a @juanpaocampo45) (#44)
**Estado en GitHub:** OPEN | **Columna Kanban:** Backlog
**Enlace:** https://github.com/C3-IS0289-2026/Restaurante-Avanzado/issues/44

### Descripción
Tarea atomizada de la historia original: HU-006: Actualización de Estado de Preparación

**Asignado a:** @juanpaocampo45

Detalles técnicos a implementar durante el sprint.

---

