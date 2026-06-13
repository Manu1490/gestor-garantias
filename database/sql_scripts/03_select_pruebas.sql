-- ============================================================
-- 03_select_pruebas.sql
-- Consultas para verificar que todo se creó correctamente
-- ============================================================

USE GarantiasDB;
GO

SELECT *
FROM dbo.Productos;
GO

SELECT *
FROM dbo.Clientes;
GO

SELECT *
FROM dbo.ProductoCompradoCliente;
GO

SELECT *
FROM dbo.GarantiasSolicitadas;
GO

USE GarantiasDB;
GO

SELECT
    gs.Id AS GarantiaId,
    gs.Estado,
    gs.MotivoSolicitud,
    gs.DescripcionProblema,
    gs.ObservacionSolicitud,
    gs.FechaSolicitud,

    c.Nombre,
    c.Apellido,
    c.Email,
    c.Telefono,

    p.Marca,
    p.Modelo,
    p.Tipo,
    p.Descripcion AS ProductoDescripcion,
    p.Proveedor,

    pcc.NumeroSerie,
    pcc.NumeroFactura,
    pcc.LugarCompra,
    pcc.FechaCompra
FROM dbo.GarantiasSolicitadas gs
INNER JOIN dbo.ProductoCompradoCliente pcc
    ON gs.ProductoCompradoClienteId = pcc.Id
INNER JOIN dbo.Clientes c
    ON pcc.ClienteId = c.Id
INNER JOIN dbo.Productos p
    ON pcc.ProductoId = p.Id;
GO