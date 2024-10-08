CREATE OR ALTER PROCEDURE [dbo].[service_request_accept]
	@ServiceRequestId INT,
	@AcceptedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE ServiceRequestAssignee
	SET 
		IsAssigneeAccepted = 1,
		AcceptedOn = GETUTCDATE()
	WHERE
		ServiceRequestId = @ServiceRequestId AND
		@AcceptedBy = AssigneeId
END