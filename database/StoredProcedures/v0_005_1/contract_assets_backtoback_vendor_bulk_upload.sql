CREATE OR ALTER     PROCEDURE [dbo].[contract_assets_backtoback_vendor_bulk_upload]
     @CreatedBy INT,
     @AssetDetails NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
    BEGIN TRAN

	UPDATE CAD
	SET 
		CAD.IsOutSourcingNeeded = 1,
		CAD.OutsourcedVendorBranchId = JSON_VALUE(AD.value, '$.VendorBranchId'),
		CAD.VendorContractNumber = JSON_VALUE(AD.value, '$.VendorContractNumber')
	FROM 
		ContractAssetDetail CAD
	INNER JOIN 
		OPENJSON(@AssetDetails) AS AD
		ON CAD.Id = JSON_VALUE(AD.value, '$.AssetId');

	UPDATE VB
	SET 	
		VB.TollfreeNumber = COALESCE(NULLIF(JSON_VALUE(AD.value, '$.TollFreeNumber'), ''), VB.TollfreeNumber),
		VB.Email = COALESCE(NULLIF(JSON_VALUE(AD.value, '$.Email'), ''), VB.Email)
	FROM 
		 VendorBranch VB
	INNER JOIN 
		OPENJSON(@AssetDetails) AS AD
		ON VB.Id = JSON_VALUE(AD.value, '$.VendorBranchId');
	COMMIT TRAN
END