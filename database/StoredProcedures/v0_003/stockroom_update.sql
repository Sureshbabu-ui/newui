CREATE OR ALTER PROCEDURE [dbo].[stockroom_update]
	@Id INT,
    @RoomName VARCHAR(32),
	@Description VARCHAR(128),
	@IsActive VARCHAR(8),
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
    UPDATE StockRoom
    SET RoomName = @RoomName,
		IsActive = @IsActive,
		[Description] = @Description,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END