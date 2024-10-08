CREATE OR ALTER PROCEDURE [dbo].[contractassetdetail_edit_info]
	@Id INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CAD.Id,
		CAD.IsActive,
		A.AssetProductCategoryId AS ProductCategoryId,
		A.ProductMakeId,
		A.ProductModelId,
		A.ProductSerialNumber,
		A.MspAssetId ,
		A.CustomerAssetId,
		CAD.AmcEndDate,
		CAD.AmcStartDate,
		CAD.AmcValue,
		CAD.IsEnterpriseProduct ,
		CAD.IsOutSourcingNeeded,
		CAD.IsPreAmcCompleted,
		CAD.IsPreventiveMaintenanceNeeded,
		CAD.ResolutionTimeInHours,
		CAD.ResponseTimeInHours,
		CAD.StandByTimeInHours,
		CAD.ProductConditionId,
		A.WarrantyEndDate,
		A.CustomerSiteId,
		CAD.ProductSupportTypeId,
		CAD.PreAmcCompletedDate,
		CAD.PreAmcCompletedBy,
		CAD.PreventiveMaintenanceFrequencyId,
		CAD.IsVipProduct
	FROM ContractAssetDetail CAD
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
	WHERE
		CAD.Id = @Id
END
