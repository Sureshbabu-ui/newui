CREATE OR ALTER PROCEDURE [dbo].[contractasset_deactivation_validation]
	@AssetIdList NVARCHAR(MAX)
AS 
BEGIN 
SET NOCOUNT ON;
	SELECT Asset.ProductSerialNumber
	FROM  ContractAssetDetail CAD
	INNER JOIN Asset ON Asset.Id = CAD.AssetId
	INNER JOIN ServiceRequest SR ON SR.ContractAssetId = CAD.AssetId
	INNER JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD'))
	WHERE CAD.Id IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@AssetIdList, ','));
END
