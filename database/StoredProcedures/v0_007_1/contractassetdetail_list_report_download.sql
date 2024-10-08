CREATE OR ALTER PROCEDURE [dbo].[contractassetdetail_list_report_download]
	@TimeZone VARCHAR(64),
	@ContractId INT,
	@SupportType BIT,
	@PreAmcStatus BIT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @DateFormat VARCHAR(16) = 'dd-MM-yyyy';

	SELECT 
		(CASE WHEN CAD.IsEnterpriseProduct = 1 THEN 'YES' ELSE 'NO' END) AS IsEnterpriseProduct,
		CAD.ResolutionTimeInHours,
		CAD.ResponseTimeInHours,
		CAD.StandByTimeInHours,
		CAD.AssetWarrantyTypeCode,
		(CASE WHEN CAD.IsVipProduct = 1 THEN 'YES' ELSE 'NO' END) AS IsVipProduct,
		CAD.AmcValue,
		(CASE WHEN CAD.IsOutSourcingNeeded = 1 THEN 'YES' ELSE 'NO' END) AS IsOutSourcingNeeded,
		Format(CAD.PreAmcCompletedDate,@DateFormat) PreAmcCompletedDate,
		(CASE WHEN CAD.IsPreAmcCompleted = 1 THEN 'YES' ELSE 'NO' END) AS IsPreAmcCompleted,
		AAM.[Name] AS AssetAddMode,
		(CASE WHEN CAD.IsPreventiveMaintenanceNeeded = 1 THEN 'YES' ELSE 'NO' END) AS IsPreventiveMaintenanceNeeded,
		PMF.[Name] AS PreventiveMaintenanceFrequency,
		Format(CAD.LastPmDate,@DateFormat) LastPmDate,
		PST.[Name] AS ProductSupportType,
		Format(CAD.AmcEndDate,@DateFormat) AmcEndDate,
		Format(CAD.AmcStartDate,@DateFormat) AmcStartDate,
		(CASE WHEN CAD.IsRenewedAsset = 1 THEN 'YES' ELSE 'NO' END) AS IsRenewedAsset,
		PC.[Name] AS ProductCondition,
		UI.FullName AS PreAmcCompletedBy,
		Asset.MspAssetId,
		Asset.CustomerAssetId,
		Asset.ProductSerialNumber,
		Asset.WarrantyEndDate,
		APC.CategoryName AS ProductCategory,
		Product.ModelName,
		Make.[Name] AS ProductMake,
		T.OfficeName AS TenantOffice,
		CS.SiteName,
		C.ContractNumber
    FROM ContractAssetDetail CAD
		INNER JOIN Asset ON Asset.Id = CAD.AssetId
		LEFT JOIN MasterEntityData AAM ON AAM.Id = CAD.AssetAddModeId
		LEFT JOIN MasterEntityData PMF ON PMF.Id = CAD.PreventiveMaintenanceFrequencyId
		LEFT JOIN MasterEntityData PST ON PST.Id = CAD.ProductSupportTypeId
		LEFT JOIN MasterEntityData PC ON PC.Id = CAD.ProductConditionId
		LEFT JOIN UserInfo UI ON UI.Id = CAD.PreAmcCompletedBy
		LEFT JOIN AssetProductCategory APC ON APC.Id = Asset.AssetProductCategoryId
		LEFT JOIN Product ON Product.Id = Asset.ProductModelId
		LEFT JOIN Make ON Make.Id = Asset.ProductMakeId
		LEFT JOIN TenantOffice T ON T.Id = Asset.TenantOfficeId
		LEFT JOIN CustomerSite CS ON CS.Id = Asset.CustomerSiteId
		LEFT JOIN [Contract] C ON C.Id = CAD.ContractId
	WHERE 
		(@ContractId IS NULL OR CAD.ContractId = @ContractId) AND
		CAD.ContractInterimAssetId IS NULL  AND
		(@PreAmcStatus IS NULL OR CAD.IsPreAmcCompleted = @PreAmcStatus) AND
		(@SupportType IS NULL OR CAD.IsOutSourcingNeeded = @SupportType)
	ORDER BY CAD.CreatedOn DESC
END