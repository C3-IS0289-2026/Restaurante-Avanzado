# Diagramas de Historias de Usuario

A continuación se presentan los diagramas (diagramas de secuencia y flujo) correspondientes a cada una de las Historias de Usuario (HU) descritas en el **Plan de Sprints** e **Historias Atomizadas**.

---

## Sprint 1: Bases, UI Inicial y CRUD

### HU-001: Visualización del Mapa de Mesas
```mermaid
sequenceDiagram
    actor Mesero
    participant UI as Frontend (Mapa)
    participant Backend
    participant BD as Base de Datos

    Mesero->>UI: Accede a vista del mapa de mesas
    UI->>Backend: Solicita estado actual de mesas
    Backend->>BD: Consulta estado de mesas
    BD-->>Backend: Retorna datos de mesas
    Backend-->>UI: Envía estado (Libre/Ocupada)
    UI-->>Mesero: Muestra mapa con colores según estado
    
    loop Actualización en Tiempo Real
        Backend->>UI: Notifica cambio de estado (WebSocket/SSE)
        UI-->>Mesero: Actualiza color de mesa responsivamente
    end
```

### HU-002: Apertura de Mesa
```mermaid
sequenceDiagram
    actor Mesero
    participant UI as Frontend
    participant Backend
    participant BD as Base de Datos

    Mesero->>UI: Selecciona mesa libre y presiona "Abrir"
    UI-->>Mesero: Muestra formulario (No. Personas)
    Mesero->>UI: Ingresa No. de personas y confirma
    UI->>Backend: Petición para abrir mesa (MesaID, No. Personas, MeseroID)
    Backend->>BD: Verifica que la mesa siga libre
    alt Mesa Ocupada
        BD-->>Backend: Estado: Ocupada
        Backend-->>UI: Error: La mesa ya está ocupada
        UI-->>Mesero: Muestra mensaje de error
    else Mesa Libre
        BD-->>Backend: Estado: Libre
        Backend->>BD: Actualiza estado a "Ocupada", registra hora de apertura y asigna mesero
        BD-->>Backend: Confirmación
        Backend-->>UI: Éxito
        UI->>UI: Actualiza estado de mesa visualmente
        UI-->>Mesero: Mesa abierta exitosamente
    end
```

### HU-008: Gestión de Menú (CRUD)
```mermaid
flowchart TD
    A[Administrador] -->|Abre Gestión de Menú| B(Vista Listado de Platillos)
    B -->|Buscar/Filtrar| B
    B -->|Click 'Nuevo Platillo'| C[Formulario de Creación]
    C -->|Llena campos y guarda| D{Backend}
    D -->|Valida y Guarda| B
    B -->|Click 'Editar Platillo'| E[Formulario de Edición]
    E -->|Edita precio/descripción y guarda| D
    B -->|Click 'Eliminar Platillo'| F{Confirmar Borrado Lógico}
    F -->|Sí| G[Backend: Soft Delete]
    G --> B
```

### HU-009: Receta de Platillos (Estructura y UI)
```mermaid
flowchart TD
    A[Administrador/Chef] --> B[Gestión de Recetas]
    B --> C[Definir estructura de datos de receta e ingredientes]
    C --> D[Interfaz: Agregar Ingredientes a un Platillo]
    D --> E[Establecer control de porciones]
    E --> F[Backend: Cálculo de costo teórico]
    F --> G[Guardar Receta]
    
    H[Cocinero] --> I[Vista de Lectura de Recetas en Cocina]
    I --> J[Consulta preparación e ingredientes detallados]
```

---

## Sprint 2 & 3: Lógica Backend, Toma de Pedidos, KDS

### HU-003: Toma de Pedidos (Comanda)
```mermaid
sequenceDiagram
    actor Mesero
    participant UI as Frontend (Toma de Pedido)
    participant Backend
    participant KDS as Pantalla KDS (Cocina)

    Mesero->>UI: Selecciona categoría de menú
    UI-->>Mesero: Muestra platillos disponibles
    Mesero->>UI: Selecciona platillo y agrega al carrito
    UI->>UI: Actualiza carrito
    Mesero->>UI: Agrega notas o modificaciones al platillo
    UI->>UI: Guarda notas en carrito local
    Mesero->>UI: Confirma y envía comanda
    UI->>Backend: Envía detalles de comanda
    Backend-->>UI: Confirma recepción
    Backend->>KDS: Emite nueva comanda en tiempo real
```

### HU-005: Pantalla de Recepción de Comandas (KDS)
```mermaid
sequenceDiagram
    actor Cocinero
    participant KDS as Pantalla KDS
    participant Backend

    Cocinero->>KDS: Accede a la vista KDS (Estructura de Columnas)
    KDS->>Backend: Conecta al flujo de tiempo real (WebSocket)
    Backend-->>KDS: Envía comandas pendientes
    loop Recepción de Comandas
        Backend->>KDS: Notifica nueva comanda
        KDS->>KDS: Ordena tickets por tiempo de espera
        KDS-->>Cocinero: Muestra nuevo ticket con detalles y notas del cliente
    end
```

### HU-006: Actualización de Estado de Preparación
```mermaid
sequenceDiagram
    actor Cocinero
    participant KDS as Pantalla KDS
    participant Backend
    participant BD as Base de Datos

    Cocinero->>KDS: Click en "En Preparación" sobre un ticket
    KDS->>Backend: Solicita cambio de estado
    Backend->>BD: Valida transición (evitar cambios inválidos)
    BD-->>Backend: Validación OK
    Backend->>BD: Actualiza estado de la comanda
    Backend-->>KDS: Refleja cambio de estado en tiempo real
    KDS-->>Cocinero: Mueve ticket a columna "En Preparación"
    
    Cocinero->>KDS: Click en "Listo" sobre un ticket
    KDS->>Backend: Solicita cambio a "Listo"
    Backend->>BD: Actualiza estado
    Backend-->>KDS: Refleja cambio
    KDS-->>Cocinero: Mueve ticket a columna "Listo"
```

---

## Sprint 4 & 5: Cierre, Notificaciones e Inventario

### HU-004: Cierre de Cuenta y Pago
```mermaid
sequenceDiagram
    actor Mesero
    participant UI as Frontend
    participant Backend
    participant BD as Base de Datos

    Mesero->>UI: Solicita cuenta de la mesa
    UI->>Backend: Pide resumen de cuenta
    Backend->>BD: Calcula subtotal e impuestos
    BD-->>Backend: Retorna datos
    Backend-->>UI: Muestra resumen (subtotal, impuestos, total)
    Mesero->>UI: Elige división de cuenta (por persona/items)
    UI->>UI: Recalcula y muestra montos divididos
    Mesero->>UI: Registra método de pago (Efectivo/Tarjeta)
    UI->>Backend: Envía confirmación de pago
    Backend->>BD: Registra pago y libera la mesa
    Backend-->>UI: Pago exitoso y mesa liberada
```

### HU-007: Notificación de Platillo Listo
```mermaid
sequenceDiagram
    participant Backend
    participant NotifService as Servicio Notificaciones
    participant UI as App Mesero
    actor Mesero

    Backend->>NotifService: Evento: Comanda marcada como "Listo"
    NotifService->>UI: Envía notificación push/web al mesero asignado
    UI-->>Mesero: Muestra indicador de notificaciones no leídas (Vista de Mesas)
    Mesero->>UI: Abre panel de notificaciones
    Mesero->>UI: Acción: Marcar como leída/entregada
    UI->>Backend: Notifica lectura
    Backend-->>UI: Confirma actualización de estado
```

### HU-010: Descuento Automático de Inventario
```mermaid
sequenceDiagram
    participant UI as Frontend
    participant Backend
    participant BD as Base de Datos (Inventario)

    UI->>Backend: Mesero confirma nueva comanda
    Backend->>BD: Enlaza comanda con ingredientes de receta
    Backend->>BD: Calcula reducción de stock (Control de porciones)
    alt Stock Insuficiente
        BD-->>Backend: Error: Sin stock suficiente
        Backend-->>UI: Retorna manejo de error a UI (No se puede pedir)
    else Stock Suficiente
        BD-->>Backend: Reducción exitosa
        Backend->>BD: Guarda registro histórico de movimientos por venta
        Backend-->>UI: Comanda procesada con éxito
    end
```

### HU-011: Alerta de Stock Mínimo
```mermaid
sequenceDiagram
    participant TareaProgramada as Trigger / Cron Job
    participant BD as Base de Datos
    participant Backend
    participant UI as Dashboard Gerente
    actor Gerente

    TareaProgramada->>Backend: Inicia evaluación de inventario tras ventas
    Backend->>BD: Consulta ingredientes con [Stock Actual <= Stock Mínimo]
    BD-->>Backend: Retorna lista de alertas
    Backend->>Backend: Genera notificaciones
    Backend->>UI: Actualiza dashboard con productos en alerta
    Backend->>Gerente: Envía notificación (Correo/Push) al gerente de compras
    Gerente->>UI: Revisa dashboard y toma acción (Compras)
```
