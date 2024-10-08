CREATE OR ALTER     PROCEDURE [dbo].[servicerequest_details_for_email] 
    @ServiceRequestId INT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT
	 SR.CaseId,
	 SR.WorkOrderNumber,
	 MED.Name AS CaseStatus,
	 CI.Name AS CustomerName,
	 CI.PrimaryContactEmail,
	 P.ModelName,
	 Asset.ProductSerialNumber,
	 MasterEntityData.Name AS ProductSupportType
    FROM ServiceRequest SR
	LEFT JOIN MasterEntityData MED ON MED.Id = SR.CaseStatusId
	INNER JOIN CustomerInfo CI ON CI.Id = SR.CustomerInfoId
	LEFT JOIN ContractAssetDetail ON ContractAssetDetail.Id = SR.ContractAssetId
	LEFT JOIN Asset ON Asset.Id = ContractAssetDetail.AssetId
	LEFT JOIN Product P ON P.Id = Asset.ProductModelId
	LEFT JOIN MasterEntityData  ON MasterEntityData.Id = ContractAssetDetail.ProductSupportTypeId
    WHERE 
        SR.Id = @ServiceRequestId 
END