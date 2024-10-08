CREATE OR ALTER PROCEDURE [dbo].[state_update] 
	@Id INT,
    @Name VARCHAR(32),
	@GstStateCode VARCHAR(64),
	@GstStateName VARCHAR(16),
    @UpdatedBy INT,
    @CountryId INT
AS
BEGIN 
    SET NOCOUNT ON;
   UPDATE State
   SET  [Name] = @Name,
        CountryId =  @CountryId,
		GstStateCode = @GstStateCode,
		GstStateName = @GstStateName,
        UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END