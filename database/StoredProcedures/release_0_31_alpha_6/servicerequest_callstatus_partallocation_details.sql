CREATE OR ALTER  PROCEDURE [dbo].[servicerequest_callstatus_partallocation_details]
    @ServiceRequestId INT
AS
BEGIN
SET NOCOUNT ON;
	
	BEGIN
	SELECT 
		GIRN.AllocatedOn ,
		GIRN.ReceivedOn,
		AB.FullName AS AllocatedBy,
		UI.FullName AS ReceivedBy 
	FROM 
	    ServiceRequest SR
		LEFT JOIN PartIndentDemand PID ON PID.WorkOrderNumber = SR.WorkOrderNumber
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId = PID.Id
		LEFT JOIN UserInfo UI ON UI.Id = GIRN.RecipientUserId	
		LEFT JOIN UserInfo AB ON AB.Id = GIRN.CreatedBy	
	WHERE
		    SR.Id = @ServiceRequestId AND 
			GIRN.PartIndentDemandId = PID.Id AND
			GIRN.AllocatedOn IS NOT NULL
	END
END