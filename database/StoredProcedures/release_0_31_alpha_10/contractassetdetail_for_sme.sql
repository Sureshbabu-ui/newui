
CREATE OR ALTER PROCEDURE [dbo].[contractassetdetail_for_sme]
  @SerialNumber NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
	SELECT 
	 A.MspAssetId,
     A.CustomerAssetId,
	 APC.CategoryName AS AssetProductCategory,
	 M.Name AS Make,
	 P.ModelName,
	 A.ProductSerialNumber,
	 A.WarrantyEndDate,
	 CS.Address AS CustomerSite,
	 CAD.AmcValue,
	 C.ContractNumber,
	 CAD.ResolutionTimeInHours,
	 CAD.ResponseTimeInHours,
	 CAD.StandByTimeInHours,
	 CAD.IsOutSourcingNeeded,
	 CAD.IsPreAmcCompleted,
	 CAD.AmcStartDate,
	 CAD.AmcEndDate

FROM Asset A
INNER JOIN ContractAssetDetail CAD ON CAD.AssetId = A.Id
INNER JOIN AssetProductCategory APC ON APC.Id = A.AssetProductCategoryId
INNER JOIN Make M ON M.Id = A.ProductMakeId
INNER JOIN Product P ON P.Id = A.ProductModelId
INNER JOIN CustomerSite CS ON CS.Id = A.CustomerSiteId
INNER JOIN Contract C ON C.Id = CAD.ContractId
WHERE
A.ProductSerialNumber = @SerialNumber AND CAD.IsActive = 1
    
END;