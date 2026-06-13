-- ============================================================
-- 01_create_tables.sql
-- Crea las tablas principales del sistema
-- ============================================================

USE GarantiasDB;
GO

-- ============================================================
-- TABLA: Clientes
-- Guarda los datos básicos del cliente
-- ============================================================

IF OBJECT_ID('dbo.Clientes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clientes
    (
        Id INT IDENTITY(1,1) NOT NULL,
        Nombre NVARCHAR(100) NOT NULL,
        Apellido NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        Telefono NVARCHAR(50) NULL,
        Documento NVARCHAR(50) NULL,
        FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT PK_Clientes PRIMARY KEY (Id),
        CONSTRAINT UQ_Clientes_Email UNIQUE (Email)
    );
END
GO

-- ============================================================
-- TABLA: Productos
-- Productos registrados previamente por la empresa
-- ============================================================

IF OBJECT_ID('dbo.Productos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Productos
    (
        Id INT IDENTITY(1,1) NOT NULL,
        Marca NVARCHAR(100) NOT NULL,
        Modelo NVARCHAR(100) NOT NULL,
        Tipo NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(500) NULL,
        Proveedor NVARCHAR(150) NOT NULL,
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT PK_Productos PRIMARY KEY (Id)
    );
END
GO

-- ============================================================
-- TABLA: ProductoCompradoCliente
-- Guarda los productos comprados por cada cliente
-- ============================================================

IF OBJECT_ID('dbo.ProductoCompradoCliente', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProductoCompradoCliente
    (
        Id INT IDENTITY(1,1) NOT NULL,

        ClienteId INT NOT NULL,
        ProductoId INT NOT NULL,

        NumeroSerie NVARCHAR(100) NOT NULL,
        NumeroFactura NVARCHAR(100) NULL,
        LugarCompra NVARCHAR(150) NULL,
        FechaCompra DATE NOT NULL,

        Observacion NVARCHAR(500) NULL,
        FechaRegistro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT PK_ProductoCompradoCliente PRIMARY KEY (Id),

        CONSTRAINT FK_ProductoCompradoCliente_Clientes 
            FOREIGN KEY (ClienteId) REFERENCES dbo.Clientes(Id),

        CONSTRAINT FK_ProductoCompradoCliente_Productos 
            FOREIGN KEY (ProductoId) REFERENCES dbo.Productos(Id),

        CONSTRAINT UQ_ProductoCompradoCliente_NumeroSerie 
            UNIQUE (NumeroSerie)
    );
END
GO

-- ============================================================
-- TABLA: GarantiasSolicitadas
-- Guarda las solicitudes de garantía realizadas por clientes
-- ============================================================

IF OBJECT_ID('dbo.GarantiasSolicitadas', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.GarantiasSolicitadas
    (
        Id INT IDENTITY(1,1) NOT NULL,

        ProductoCompradoClienteId INT NOT NULL,

        Estado NVARCHAR(50) NOT NULL DEFAULT 'Pendiente',

        MotivoSolicitud NVARCHAR(500) NOT NULL,
        DescripcionProblema NVARCHAR(1000) NOT NULL,

        ObservacionSolicitud NVARCHAR(1000) NULL,

        FechaSolicitud DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        FechaActualizacion DATETIME2 NULL,
        FechaCierre DATETIME2 NULL,

        CONSTRAINT PK_GarantiasSolicitadas PRIMARY KEY (Id),

        CONSTRAINT FK_GarantiasSolicitadas_ProductoCompradoCliente
            FOREIGN KEY (ProductoCompradoClienteId) 
            REFERENCES dbo.ProductoCompradoCliente(Id),

        CONSTRAINT CK_GarantiasSolicitadas_Estado
            CHECK (Estado IN 
            (
                'Pendiente',
                'En Revision',
                'Aprobada',
                'Rechazada',
                'Cerrada'
            ))
    );
END
GO

-- ============================================================
-- 02_insert_productos_demo.sql
-- Inserta productos iniciales de prueba
-- ============================================================

USE GarantiasDB;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Productos)
BEGIN
    INSERT INTO dbo.Productos
    (
        Marca,
        Modelo,
        Tipo,
        Descripcion,
        Proveedor
    )
    VALUES
    (
        'Samsung',
        'RT38K5932SL',
        'Heladera',
        'Heladera no frost con freezer superior',
        'Samsung Argentina'
    ),
    (
        'LG',
        'WM10WVC4S6',
        'Lavarropa',
        'Lavarropa automático carga frontal 10kg',
        'LG Electronics'
    ),
    (
        'Philips',
        '55PUD7408',
        'TV',
        'Smart TV LED 55 pulgadas 4K',
        'Philips Argentina'
    ),
    (
        'Drean',
        'Next 8.14',
        'Secarropa',
        'Secarropa por calor compacto',
        'Drean'
    ),
    (
        'Longvie',
        '13331XF',
        'Cocina',
        'Cocina a gas 4 hornallas con horno',
        'Longvie'
    );
END
GO

-- ============================================================
-- Datos de prueba: cliente y producto comprado
-- ============================================================

USE GarantiasDB;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Clientes WHERE Email = 'cliente.demo@email.com')
BEGIN
    INSERT INTO dbo.Clientes
    (
        Nombre,
        Apellido,
        Email,
        Telefono,
        Documento
    )
    VALUES
    (
        'Cliente',
        'Demo',
        'cliente.demo@email.com',
        '1122334455',
        '12345678'
    );
END
GO

DECLARE @ClienteId INT;
DECLARE @ProductoId INT;

SELECT @ClienteId = Id
FROM dbo.Clientes
WHERE Email = 'cliente.demo@email.com';

SELECT @ProductoId = Id
FROM dbo.Productos
WHERE Marca = 'Samsung'
  AND Modelo = 'RT38K5932SL';

IF NOT EXISTS 
(
    SELECT 1 
    FROM dbo.ProductoCompradoCliente 
    WHERE NumeroSerie = 'SN-DEMO-0001'
)
BEGIN
    INSERT INTO dbo.ProductoCompradoCliente
    (
        ClienteId,
        ProductoId,
        NumeroSerie,
        NumeroFactura,
        LugarCompra,
        FechaCompra,
        Observacion
    )
    VALUES
    (
        @ClienteId,
        @ProductoId,
        'SN-DEMO-0001',
        'F001-00012345',
        'Sucursal Avellaneda',
        '2026-06-01',
        'Producto registrado como prueba inicial'
    );
END
GO

-- ============================================================
-- Datos de prueba: solicitud de garantía
-- ============================================================

USE GarantiasDB;
GO

DECLARE @ProductoCompradoClienteId INT;

SELECT @ProductoCompradoClienteId = Id
FROM dbo.ProductoCompradoCliente
WHERE NumeroSerie = 'SN-DEMO-0001';

IF NOT EXISTS
(
    SELECT 1
    FROM dbo.GarantiasSolicitadas
    WHERE ProductoCompradoClienteId = @ProductoCompradoClienteId
)
BEGIN
    INSERT INTO dbo.GarantiasSolicitadas
    (
        ProductoCompradoClienteId,
        MotivoSolicitud,
        DescripcionProblema,
        ObservacionSolicitud
    )
    VALUES
    (
        @ProductoCompradoClienteId,
        'Falla de funcionamiento',
        'El producto no enfría correctamente luego de varios días de uso.',
        NULL
    );
END
GO