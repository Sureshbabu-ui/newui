CREATE OR ALTER  PROCEDURE [dbo].[city_update]
	@Id INT,
    @Code VARCHAR(8),
    @Name VARCHAR(32),
    @UpdatedBy INT,
    @StateId INT,
    @TenantOfficeId INT
AS
BEGIN 
    SET NOCOUNT ON;
    UPDATE City
    SET Code = @Code,
        [Name] = @Name,
        StateId = @StateId,
        TenantOfficeId = @TenantOfficeId,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END 