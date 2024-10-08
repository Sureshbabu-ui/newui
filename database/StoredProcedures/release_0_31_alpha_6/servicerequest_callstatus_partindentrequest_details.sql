CREATE OR ALTER  PROCEDURE [dbo].[servicerequest_callstatus_partindentrequest_details]
    @ServiceRequestId INT
AS
BEGIN
SET NOCOUNT ON;
	
	SELECT 
		P.PartName,
		MED.Name AS StockType,
		P.Description,
		PIRD.Quantity,
		PIRD.IsWarrantyReplacement,
		PIRD.CreatedOn AS RequestedDate,
		UI.FullName AS RequestedBy,
		PRS.[Name] AS PartIndentRequestStatus,
		PIRD.ReviewedOn AS ApprovedDate		
	FROM 
		PartIndentRequest PIR
		LEFT JOIN PartIndentRequestDetail PIRD ON PIRD.PartIndentRequestId = PIR.Id
		LEFT JOIN MasterEntityData MED ON PIRD.StockTypeId = MED.Id
		LEFT JOIN MasterEntityData PRS ON PIRD.RequestStatusId = PRS.Id
		LEFT JOIN UserInfo UI ON UI.Id = PIRD.CreatedBy
		LEFT JOIN Part P ON P.Id = PIRD.PartId			
	WHERE
		    PIR.ServiceRequestId = @ServiceRequestId
END