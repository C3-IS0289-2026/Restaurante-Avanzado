# Listado de Historias de Usuario Atomizadas

A continuación se presenta el listado de Historias de Usuario reestructuradas, segmentadas en tareas más pequeñas para ser distribuidas a lo largo de los sprints.

## HU-001: Visualización del Mapa de Mesas
**Asignado a:** @DouCiv

### Tareas Atomizadas:
- [ ] HU-001.1: Crear la estructura base del mapa de mesas (UI estática)
- [ ] HU-001.2: Conectar mapa de mesas con el backend para estado en tiempo real
- [ ] HU-001.3: Diferenciar colores de mesas por estado (Libre, Ocupada)
- [ ] HU-001.4: Refinar diseño responsivo del mapa de mesas

## HU-002: Apertura de Mesa
**Asignado a:** @DouCiv

### Tareas Atomizadas:
- [ ] HU-002.1: Diseño del formulario de apertura de mesa (número de personas)
- [ ] HU-002.2: Lógica para registrar hora de apertura y asignar mesero
- [ ] HU-002.3: Validación de mesa ya ocupada
- [ ] HU-002.4: Integración del cambio de estado en el mapa de mesas al abrir

## HU-003: Toma de Pedidos (Comanda)
**Asignado a:** @DiaxJF

### Tareas Atomizadas:
- [ ] HU-003.1: Interfaz para seleccionar platillos del menú por categorías
- [ ] HU-003.2: Lógica de carrito de compras (agregar/quitar platillos)
- [ ] HU-003.3: Capacidad para agregar notas o modificaciones a platillos
- [ ] HU-003.4: Envío de la comanda al backend y KDS

## HU-004: Cierre de Cuenta y Pago
**Asignado a:** @DiaxJF

### Tareas Atomizadas:
- [ ] HU-004.1: Mostrar resumen de la cuenta (subtotal, impuestos, total)
- [ ] HU-004.2: Opciones de división de cuenta (por persona o items)
- [ ] HU-004.3: Registro de método de pago (Efectivo, Tarjeta, etc.)
- [ ] HU-004.4: Lógica de liberación de la mesa tras pago exitoso

## HU-005: Pantalla de Recepción de Comandas (KDS)
**Asignado a:** @juanpaocampo45

### Tareas Atomizadas:
- [ ] HU-005.1: Estructura de la vista KDS (Columnas por estado)
- [ ] HU-005.2: Recepción en tiempo real de nuevas comandas
- [ ] HU-005.3: Mostrar detalles del pedido y notas del cliente
- [ ] HU-005.4: Ordenar tickets por tiempo de espera

## HU-006: Actualización de Estado de Preparación
**Asignado a:** @juanpaocampo45

### Tareas Atomizadas:
- [ ] HU-006.1: Botones para cambiar estado a "En Preparación" y "Listo"
- [ ] HU-006.2: Lógica backend para actualizar estado de la comanda
- [ ] HU-006.3: Reflejar cambio de estado en pantalla KDS en tiempo real
- [ ] HU-006.4: Validaciones para evitar cambios de estado inválidos

## HU-007: Notificación de Platillo Listo
**Asignado a:** @juan4298jose

### Tareas Atomizadas:
- [ ] HU-007.1: Sistema base para emitir notificaciones push/web al mesero
- [ ] HU-007.2: UI de notificaciones no leídas en la app del mesero
- [ ] HU-007.3: Acción para marcar notificación como leída o entregada
- [ ] HU-007.4: Integración de notificaciones con la vista de mesas

## HU-008: Gestión de Menú (CRUD)
**Asignado a:** @juan4298jose

### Tareas Atomizadas:
- [ ] HU-008.1: Formulario para crear un nuevo platillo con sus campos básicos
- [ ] HU-008.2: Vista de listado de platillos con búsqueda y filtros
- [ ] HU-008.3: Función para editar precio y descripción de un platillo
- [ ] HU-008.4: Implementar borrado lógico (soft delete) de platillos

## HU-009: Receta de Platillos
**Asignado a:** @Bree-zzz

### Tareas Atomizadas:
- [ ] HU-009.1: Definir estructura de datos de receta e ingredientes
- [ ] HU-009.2: Interfaz para agregar ingredientes a un platillo
- [ ] HU-009.3: Vista de lectura de recetas para el personal de cocina
- [ ] HU-009.4: Control de porciones y cálculo de costo teórico

## HU-010: Descuento Automático de Inventario
**Asignado a:** @Bree-zzz

### Tareas Atomizadas:
- [ ] HU-010.1: Lógica para enlazar comanda con ingredientes de receta
- [ ] HU-010.2: Reducción automática de stock tras confirmación de pedido
- [ ] HU-010.3: Manejo de errores cuando no hay suficiente stock
- [ ] HU-010.4: Registro histórico de movimientos de inventario por ventas

## HU-011: Alerta de Stock Mínimo
**Asignado a:** @David3560

### Tareas Atomizadas:
- [ ] HU-011.1: Definir campo de "Stock mínimo" en gestión de ingredientes
- [ ] HU-011.2: Tarea programada o trigger que evalúa inventario tras descuentos
- [ ] HU-011.3: UI de dashboard para productos en alerta de stock
- [ ] HU-011.4: Notificación a gerente/compras de stock bajo

