# Plan de Sprints: Sistema de Gestión de Restaurante

Basado en el análisis de complejidad y dependencias, se ha estructurado el proyecto en **5 Sprints** iterativos. Cada sprint contiene entre 8 y 9 tareas atomizadas, asegurando que los **6 estudiantes participen de manera equitativa**, tomando de **1 a 2 tareas por Sprint**.

Se ha reasignado la tarea **HU-010.3** a David3560 para balancear la carga técnica con Bree-zzz en el Sprint 4.

---

## Sprint 1: Bases, UI Inicial y CRUD (9 Tareas)
**Objetivo:** Establecer la interfaz estática principal y comenzar la gestión del menú y recetas.
* **DouCiv:**
  * HU-001.1: Crear la estructura base del mapa de mesas (UI estática)
  * HU-002.1: Diseño del formulario de apertura de mesa (número de personas)
* **DiaxJF:**
  * HU-003.1: Interfaz para seleccionar platillos del menú por categorías
* **juanpaocampo45:**
  * HU-005.1: Estructura de la vista KDS (Columnas por estado)
* **juan4298jose:**
  * HU-008.1: Formulario para crear un nuevo platillo con sus campos básicos
  * HU-008.2: Vista de listado de platillos con búsqueda y filtros
* **Bree-zzz:**
  * HU-009.1: Definir estructura de datos de receta e ingredientes
  * HU-009.2: Interfaz para agregar ingredientes a un platillo
* **David3560:**
  * HU-011.1: Definir campo de "Stock mínimo" en gestión de ingredientes

---

## Sprint 2: Lógica Backend Inicial y Conexiones (9 Tareas)
**Objetivo:** Dotar de lógica a la creación de comandas, persistencia de menús y estados base.
* **DouCiv:**
  * HU-001.2: Conectar mapa de mesas con el backend para estado en tiempo real
  * HU-002.2: Lógica para registrar hora de apertura y asignar mesero
* **DiaxJF:**
  * HU-003.2: Lógica de carrito de compras (agregar/quitar platillos)
  * HU-003.3: Capacidad para agregar notas o modificaciones a platillos
* **juanpaocampo45:**
  * HU-006.1: Botones para cambiar estado a "En Preparación" y "Listo"
* **juan4298jose:**
  * HU-008.3: Función para editar precio y descripción de un platillo
  * HU-008.4: Implementar borrado lógico (soft delete) de platillos
* **Bree-zzz:**
  * HU-009.3: Vista de lectura de recetas para el personal de cocina
* **David3560:**
  * HU-011.2: Tarea programada o trigger que evalúa inventario tras descuentos

---

## Sprint 3: Tiempo Real, KDS y Comandas (9 Tareas)
**Objetivo:** Lograr la comunicación fluida del salón con cocina, enviando pedidos al KDS.
* **DouCiv:**
  * HU-001.3: Diferenciar colores de mesas por estado (Libre, Ocupada)
  * HU-002.3: Validación de mesa ya ocupada
* **DiaxJF:**
  * HU-003.4: Envío de la comanda al backend y KDS
* **juanpaocampo45:**
  * HU-005.2: Recepción en tiempo real de nuevas comandas
  * HU-006.2: Lógica backend para actualizar estado de la comanda
* **juan4298jose:**
  * HU-007.1: Sistema base para emitir notificaciones push/web al mesero
* **Bree-zzz:**
  * HU-009.4: Control de porciones y cálculo de costo teórico
  * HU-010.1: Lógica para enlazar comanda con ingredientes de receta
* **David3560:**
  * HU-011.3: UI de dashboard para productos en alerta de stock

---

## Sprint 4: Cierre, Notificaciones e Inventario (9 Tareas)
**Objetivo:** Permitir el pago, notificar al mesero y actualizar el inventario.
* **DouCiv:**
  * HU-001.4: Refinar diseño responsivo del mapa de mesas
* **DiaxJF:**
  * HU-004.1: Mostrar resumen de la cuenta (subtotal, impuestos, total)
  * HU-004.2: Opciones de división de cuenta (por persona o items)
* **juanpaocampo45:**
  * HU-005.3: Mostrar detalles del pedido y notas del cliente
  * HU-006.3: Reflejar cambio de estado en pantalla KDS en tiempo real
* **juan4298jose:**
  * HU-007.2: UI de notificaciones no leídas en la app del mesero
  * HU-007.3: Acción para marcar notificación como leída o entregada
* **Bree-zzz:**
  * HU-010.2: Reducción automática de stock tras confirmación de pedido
* **David3560:**
  * HU-010.3: Manejo de errores cuando no hay suficiente stock *(Apoyo transversal a Inventario)*

---

## Sprint 5: Refinamiento Final y Consolidación (8 Tareas)
**Objetivo:** Cerrar el ciclo de mesas, pulir los tableros y tener la aplicación funcional al 100%.
* **DouCiv:**
  * HU-002.4: Integración del cambio de estado en el mapa de mesas al abrir
* **DiaxJF:**
  * HU-004.3: Registro de método de pago (Efectivo, Tarjeta, etc.)
  * HU-004.4: Lógica de liberación de la mesa tras pago exitoso
* **juanpaocampo45:**
  * HU-005.4: Ordenar tickets por tiempo de espera
  * HU-006.4: Validaciones para evitar cambios de estado inválidos
* **juan4298jose:**
  * HU-007.4: Integración de notificaciones con la vista de mesas
* **Bree-zzz:**
  * HU-010.4: Registro histórico de movimientos de inventario por ventas
* **David3560:**
  * HU-011.4: Notificación a gerente/compras de stock bajo

