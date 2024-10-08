CREATE OR ALTER PROCEDURE [dbo].[servicerequest_interim_asset_detail] 
	@ServiceRequestId INT 
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @ContractId INT;
	DECLARE @AssetProductCategoryId INT;
	DECLARE @CurrentProductCount INT;
	DECLARE @ProductCountAtBooking INT;

	-- Retrieve necessary information first
	SELECT 
		@ContractId = CIA.ContractId,
		@AssetProductCategoryId = CIA.AssetProductCategoryId
	FROM 
		ServiceRequest SR
		INNER JOIN ContractInterimAsset CIA ON CIA.Id = SR.ContractInterimAssetId
	WHERE 
		SR.Id = @ServiceRequestId;

	-- Get the current product count
	SELECT 
		@CurrentProductCount = COUNT(A.Id) 
	FROM
		ContractAssetDetail CAD
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
	WHERE
		A.AssetProductCategoryId = @AssetProductCategoryId AND 
		CAD.ContractId = @ContractId

	-- Get the product count at booking

	SELECT @ProductCountAtBooking = SUM(ProductCountAtBooking) FROM ContractAssetSummary  WHERE AssetProductCategoryId = @AssetProductCategoryId AND ContractId = @ContractId

	SELECT
		PC.CategoryName,
		M.Name AS Make,
		P.ModelName,
		CS.SiteName AS CustomerSiteName,
		CS.Address AS CustomerSiteAddress,
		CS.PrimaryContactName AS CustomerContactName,
		CS.PrimaryContactEmail As CustomerContactEmail,
		CIA.Id AS InterimAssetId,
		CIA.ProductSerialNumber AS AssetSerialNumber,
		CIA.ContractId,
		CIA.CustomerSiteId,
		CIA.AssetProductCategoryId AS ProductCategoryId,
		CIA.ProductMakeId,
		CIA.ProductModelId,
		SR.Id AS ServiceRequestId,
		CIA.InterimAssetStatusId,
		CASE 
			WHEN @ProductCountAtBooking > @CurrentProductCount  THEN CAST(0 AS BIT)
			ELSE CAST(1 AS BIT)
		END AS IsProductCountExceeded
	FROM
		ServiceRequest SR
		LEFT JOIN ContractInterimAsset CIA ON CIA.Id = SR.ContractInterimAssetId
		LEFT JOIN AssetProductCategory PC ON PC.Id = CIA.AssetProductCategoryId
		LEFT JOIN Make M ON M.Id = CIA.ProductMakeId
		LEFT JOIN Product P ON P.Id = CIA.ProductModelId
		LEFT JOIN CustomerSite CS ON CS.Id = CIA.CustomerSiteId
	WHERE
		SR.Id = @ServiceRequestId
END