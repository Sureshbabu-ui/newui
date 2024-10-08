CREATE OR ALTER PROCEDURE [dbo].[servicerequest_assetdetailsforcallcordinator]
@ServiceRequestId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		PC.CategoryName,
		PC.Id AS ProductCategoryId,
		M.[Name] AS Make,
		P.ModelName,
		A.ProductSerialNumber,
		A.MspAssetId,
		A.WarrantyEndDate,
		CAD.IsVipProduct,
		CAD.IsEnterpriseProduct,
		ProductCondition.[Name] AS ProductCondition,
		CAD.IsOutSourcingNeeded,
		CAD.ResponseTimeInHours,
		CAD.ResolutionTimeInHours,
		CAD.StandByTimeInHours,
		SR.ContractId
    FROM ServiceRequest SR
		INNER JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
		INNER JOIN Asset A ON A.Id = CAD.AssetId 
		INNER JOIN AssetProductCategory PC ON PC.Id = A.AssetProductCategoryId
		INNER JOIN Make M ON M.Id = A.ProductMakeId
		INNER JOIN Product P ON P.Id = A.ProductModelId
		LEFT JOIN MasterEntityData AS ProductCondition ON ProductCondition.Id = CAD.ProductConditionId
    WHERE
		SR.Id = @ServiceRequestId
END