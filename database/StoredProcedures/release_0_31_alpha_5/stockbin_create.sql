CREATE OR ALTER PROCEDURE [dbo].[stockbin_create]
	@BinCode VARCHAR(8),    
    @BinName VARCHAR(64),
    @IsActive BIT,
    @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	INSERT INTO StockBin
	            (BinCode,   
                BinName,
				IsActive,
                CreatedBy,
                CreatedOn)
    VALUES 
				(@BinCode,   
                @BinName,
				@IsActive,
                @CreatedBy,
               	GETUTCDATE())
END 