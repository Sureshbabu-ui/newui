CREATE OR ALTER PROCEDURE [dbo].[stockbin_update]
	@Id INT,
    @BinName VARCHAR(32),
    @UpdatedBy INT,
	@IsActive VARCHAR(8)
AS
BEGIN 
    SET NOCOUNT ON;
    UPDATE StockBin
    SET BinName = @BinName,
		IsActive = @IsActive,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END