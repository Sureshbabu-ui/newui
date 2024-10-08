CREATE OR ALTER PROCEDURE [dbo].[product_update] 
	@ProductId INT,
    @ModelName VARCHAR(64),
    @Description VARCHAR(1024),
    @AssetProductCategoryId INT,
    @MakeId INT,
    @ManufacturingYear SMALLINT,
    @AmcValue INT,
	@UpdatedBy INT
AS
BEGIN 
SET NOCOUNT ON;
    UPDATE Product
    SET
        ModelName = @ModelName,
        [Description] = @Description,
		AssetProductCategoryId = @AssetProductCategoryId,
		MakeId = @MakeId,
		ManufacturingYear = @ManufacturingYear,
		AmcValue = @AmcValue,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
    WHERE
        Id = @ProductId;
END