CREATE OR ALTER  PROCEDURE [dbo].[city_create] 
    @Code VARCHAR(8),
    @Name VARCHAR(32),
    @CreatedBy INT,
    @StateId INT,
    @TenantOfficeId INT
AS
BEGIN 
    SET NOCOUNT ON;
    INSERT INTO City
            (Code,
            [Name],
            StateId,
            TenantOfficeId,
            CreatedBy,
            CreatedOn)
    VALUES
            (@Code,
            @Name,
            @StateId,
            @TenantOfficeId,
            @CreatedBy,
            GETUTCDATE())
END 