-- ============================================================
-- 00_create_database.sql
-- Crea la base de datos principal del sistema de garantías
-- ============================================================

IF DB_ID('GarantiasDB') IS NULL
BEGIN
    CREATE DATABASE GarantiasDB;
END
GO

USE GarantiasDB;
GO