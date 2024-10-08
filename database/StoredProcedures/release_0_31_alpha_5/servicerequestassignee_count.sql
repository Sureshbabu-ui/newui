CREATE OR ALTER PROCEDURE [dbo].[servicerequestassignee_count] 
	@ServiceRequestId INT,
	@TotalRows INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(Id)
	FROM ServiceRequestAssignee 
	WHERE 
		ServiceRequestId = @ServiceRequestId
END 
