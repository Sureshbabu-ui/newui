CREATE OR ALTER  PROCEDURE [dbo].[stockroom_create]
	@RoomCode VARCHAR(8),    
    @RoomName VARCHAR(64),
    @Description VARCHAR(128),
    @IsActive BIT,
    @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	INSERT INTO StockRoom
	            (RoomCode,   
                RoomName,
                [Description],
				IsActive,
                CreatedBy,
                CreatedOn)
            VALUES 
				(@RoomCode,   
                @RoomName,
				@Description,
				@IsActive,
                @CreatedBy,
               	GETUTCDATE())
END