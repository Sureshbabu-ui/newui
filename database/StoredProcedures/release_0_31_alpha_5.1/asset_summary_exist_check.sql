CREATE OR ALTER   PROCEDURE [dbo].[asset_summary_exist_check]
    @ContractId INT,
    @AssetProductCategory INT,
    @Count INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON
	SELECT @Count = COUNT(Id)
	FROM ContractAssetSummary
	WHERE AssetProductCategoryId = @AssetProductCategory AND ContractId = @ContractId;
END