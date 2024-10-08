CREATE OR ALTER  PROCEDURE [dbo].[contract_productcategorydetails]
	@ContractId INT
AS
BEGIN     
SET NOCOUNT ON;
		WITH CurrentProductCount AS (
		SELECT
			A.AssetProductCategoryId,
			COUNT(A.Id) AS CurrentProductCount
		FROM
			ContractAssetDetail CAD
			LEFT JOIN Asset A ON A.Id = CAD.AssetId
		WHERE
			CAD.ContractId = @ContractId AND CAD.IsActive = 1
		GROUP BY
			A.AssetProductCategoryId
	),
	ProductCountAtBooking AS (
		SELECT
			AssetProductCategoryId,
			SUM(ProductCountAtBooking) AS ProductCountAtBooking
		FROM
			ContractAssetSummary
		WHERE
			ContractId = @ContractId
		GROUP BY
			AssetProductCategoryId
	)
	SELECT 
		PCB.AssetProductCategoryId AS ProductCategoryId,
		ISNULL(PCB.ProductCountAtBooking, 0) - ISNULL(CPC.CurrentProductCount, 0) AS CountDifference,
		PC.CategoryName
	FROM
		ProductCountAtBooking PCB 
	LEFT JOIN CurrentProductCount CPC ON PCB.AssetProductCategoryId = CPC.AssetProductCategoryId
	LEFT JOIN AssetProductCategory PC ON PCB.AssetProductCategoryId = PC.Id;
END