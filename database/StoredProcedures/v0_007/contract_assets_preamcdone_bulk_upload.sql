CREATE OR ALTER     PROCEDURE [dbo].[contract_assets_preamcdone_bulk_upload]
     @CreatedBy INT,
     @AssetDetails NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON;
	UPDATE CAD
	SET 
		CAD.IsPreAmcCompleted = 1,
		CAD.PreAmcCompletedBy = JSON_VALUE(AD.value, '$.PreAmcCompletedById'),
		CAD.PreAmcCompletedDate = JSON_VALUE(AD.value, '$.PreAmcCompletedDate'),
		CAD.PreAmcVendorBranchId = JSON_VALUE(AD.value, '$.PreAmcVendorBranchId')
	FROM 
		ContractAssetDetail CAD
	INNER JOIN 
		OPENJSON(@AssetDetails) AS AD
		ON CAD.Id = JSON_VALUE(AD.value, '$.AssetId');
END