CREATE OR ALTER PROCEDURE [dbo].[state_create] 
    @Code VARCHAR(2),
    @Name VARCHAR(32),
	@GstStateCode VARCHAR(64),
	@GstStateName VARCHAR(16),
    @CreatedBy INT,
    @CountryId INT
AS
BEGIN 
    SET NOCOUNT ON;
    INSERT INTO State
            (Code,
            [Name],
            CountryId,
			GstStateCode,
			GstStateName,
			IsActive,
            CreatedBy,
            CreatedOn)
    VALUES
            (@Code,
            @Name,
            @CountryId,
			@GstStateCode,
			@GstStateName,
			1,
            @CreatedBy,
            GETUTCDATE())
END 