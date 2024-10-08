CREATE OR ALTER PROCEDURE [dbo].[partindentrequest_list]
	@ServiceRequestId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        PIR.Id,
		PIR.IndentRequestNumber,
		RequestedBy.FullName AS RequestedBy,
		PIR.Remarks,
		SUM(CASE WHEN PartRequestStatus.Code = 'PRT_CRTD' THEN 1 ELSE 0 END) AS CreatedRequestCount,
		SUM(CASE WHEN PartRequestStatus.Code IN ('PRT_APRV','PRT_DESP','PRT_TRNS','PRT_RCVD') THEN 1 ELSE 0 END) AS ApprovedRequestCount,
		SUM(CASE WHEN PartRequestStatus.Code = 'PRT_RJTD' THEN 1 ELSE 0 END) AS RejectedRequestCount,
	    SUM(CASE WHEN PartRequestStatus.Code = 'PRT_HOLD' THEN 1 ELSE 0 END) AS HeldRequestCount,
		PIR.IsProcessed,
		PIR.CreatedOn,
		TOF.OfficeName
	FROM PartIndentRequest  PIR
	INNER JOIN PartIndentRequestDetail  PIRD ON PIR.Id=PIRD.PartIndentRequestId
	INNER JOIN UserInfo  RequestedBy ON RequestedBy.Id = PIR.RequestedBy
	INNER JOIN MasterEntityData  PartRequestStatus ON PartRequestStatus.Id = PIRD.RequestStatusId
	INNER JOIN TenantOffice TOF ON TOF.ID=PIR.TenantOfficeId
	WHERE 
		PIR.ServiceRequestId = @ServiceRequestId
	    GROUP BY 
		PIR.Id,
		PIR.IndentRequestNumber,
		PIR.CreatedOn,
		RequestedBy.FullName,
		PIR.Remarks,	
		PIR.IsProcessed,
		TOF.OfficeName
   ORDER BY 
		PIR.Id Desc
END