# Gestor de Garantías

## 📋 Objetivo

Sistema de gestión de garantías de productos que permite registrar clientes, productos, compras y gestionar el estado de las garantías de manera eficiente.

## 🚀 Tecnologías Usadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express** v5.2.1 - Framework para crear la API REST
- **SQL Server** - Base de datos relacional
- **mssql** v12.5.5 - Driver para conectar con SQL Server
- **dotenv** v17.4.2 - Manejo de variables de entorno
- **cors** v2.8.6 - Habilitar CORS en la API
- **nodemon** v3.1.14 - Reinicio automático en desarrollo
- **pnpm** - Gestor de paquetes

## 📁 Estructura de Carpetas

```
gestor-garantias/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # Configuración de conexión a SQL Server
│   │   ├── controllers/
│   │   │   ├── clientes.controller.js   # Lógica de negocio de clientes
│   │   │   ├── producto.controller.js   # Lógica de negocio de productos
│   │   │   ├── productosComprados.controller.js
│   │   │   ├── garantias.controller.js
│   │   │   └── health.controller.js     # Estado de la API
│   │   ├── routes/
│   │   │   ├── clientes.routes.js       # Rutas de clientes
│   │   │   ├── productos.routes.js      # Rutas de productos
│   │   │   ├── productosComprados.routes.js
│   │   │   ├── garantias.routes.js
│   │   │   └── healt.routes.js          # Rutas de health check
│   │   └── server.js                    # Punto de entrada de la aplicación
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env                             # Variables de entorno (no versionado)
├── database/
│   └── sql_scripts/
│       ├── 00_create_database.sql       # Script para crear la base de datos
│       ├── 01_create_tables.sql         # Script para crear las tablas
│       └── 03_select_pruebas.sql        # Consultas de prueba
├── documentacion/
├── .gitignore
└── README.md
```

## 📦 Instalación de Dependencias

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/).

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
pnpm install
```

## ⚙️ Configuración del archivo .env

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Configuración del servidor
PORT=3000

# Configuración de SQL Server
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_SERVER=tu_servidor
DB_DATABASE=GarantiasDB
DB_INSTANCE=nombre_instancia
DB_TRUST_SERVER_CERTIFICATE=true
```

**Nota:** Reemplaza los valores según tu configuración de SQL Server.

## ▶️ Ejecutar el Backend

### Modo desarrollo (con nodemon)
```bash
cd backend
pnpm run dev
```

### Modo producción
```bash
cd backend
pnpm start
```

El servidor estará disponible en: `http://localhost:3000`

## 🔗 Endpoints Principales

### Health Check
- `GET /api/health` - Verificar estado de la API y conexión a la base de datos

### Clientes
- `GET /api/clientes` - Obtener lista de clientes
- `POST /api/clientes` - Crear un nuevo cliente

### Productos
- `GET /api/productos` - Obtener lista de productos

### Productos Comprados
- `GET /api/productos-comprados` - Obtener lista de productos comprados
- `POST /api/productos-comprados` - Registrar un producto comprado

### Garantías
- `GET /api/garantias` - Obtener lista de garantías
- `POST /api/garantias` - Crear una nueva garantía
- `PUT /api/garantias/:id/estado` - Actualizar el estado de una garantía

## 🗄️ Base de Datos

**Motor:** Microsoft SQL Server  
**Nombre de la base de datos:** `GarantiasDB`

Para crear la base de datos y las tablas, ejecuta los scripts SQL en orden:

1. `database/sql_scripts/00_create_database.sql`
2. `database/sql_scripts/01_create_tables.sql`

## 📄 Licencia

ISC