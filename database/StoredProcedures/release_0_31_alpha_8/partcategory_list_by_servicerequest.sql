CREATE OR ALTER     PROCEDURE [dbo].[partcategory_list_by_servicerequest]
    @ServiceRequestId INT
AS
BEGIN
    SET NOCOUNT ON;
   SELECT 
    PC.Id, 
    PC.Name
FROM ServiceRequest SR
INNER JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
INNER JOIN Asset A ON A.Id = CAD.AssetId
INNER JOIN AssetProductCategory APC ON APC.Id = A.AssetProductCategoryId
INNER JOIN PartProductCategoryToPartCategoryMapping PPCTPC ON PPCTPC.PartProductCategoryId = APC.PartProductCategoryId
INNER JOIN PartCategory PC ON PC.Id = PPCTPC.PartCategoryId
LEFT JOIN ContractProductCategoryPartNotCovered CPCPNC 
    ON (CPCPNC.PartCategoryId = PC.Id 
	AND  CPCPNC.IsDeleted !=1 )
    AND CPCPNC.ContractId = CAD.ContractId 
    AND CPCPNC.AssetProductCategoryId = A.AssetProductCategoryId
WHERE 
    SR.Id = @ServiceRequestId  
    AND CPCPNC.PartCategoryId IS NULL;
END