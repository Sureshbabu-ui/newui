CREATE OR ALTER   PROCEDURE [dbo].[previoustickets_list] 
    @AssetId INT = NULL,
    @ServiceRequestId INT = NULL
AS
BEGIN 
SET NOCOUNT ON;	
	IF (@AssetId IS NULL)
	BEGIN
		SELECT @AssetId = ContractAssetId   FROM ServiceRequest WHERE ID = @ServiceRequestId
	END
    SELECT
        SR.Id,
        SR.CaseId,
        SR.WorkOrderNumber,
        SR.WorkOrderCreatedOn,
        SR.CustomerReportedIssue,
		SR.ClosedOn,
        CallStatus.[Name] AS CaseStatus,
        CallStatus.Code AS CaseStatusCode
    FROM ServiceRequest SR
    LEFT JOIN MasterEntityData CallStatus ON SR.CaseStatusId = CallStatus.Id
    WHERE
        SR.ContractAssetId = @AssetId AND
        (@ServiceRequestId IS NULL OR 
        SR.Id != @ServiceRequestId)
    ORDER BY
        SR.Id DESC;
END