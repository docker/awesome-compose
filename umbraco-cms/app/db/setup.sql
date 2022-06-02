USE [master]
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'UmbracoDb')
BEGIN

    CREATE DATABASE [UmbracoDb] ON 
    ( FILENAME = N'/var/opt/sqlserver/Umbraco.mdf' ),
    ( FILENAME = N'/var/opt/sqlserver/Umbraco_log.ldf' )
    FOR ATTACH

END;
GO

USE UmbracoDb;
