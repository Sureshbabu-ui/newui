CREATE OR ALTER PROCEDURE [dbo].[servicerequest_assignee_pendingjob_count]
    @UserId        INT ,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
       @TotalRows= COUNT(SR.Id)
	FROM ServiceRequest SR
		LEFT JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
	    INNER  JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId=SR.Id AND SRA.EndsOn IS NULL AND SRA.AssigneeId=@UserId ;
END