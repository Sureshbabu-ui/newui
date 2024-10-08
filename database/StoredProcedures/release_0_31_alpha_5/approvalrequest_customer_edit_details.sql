CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_customer_edit_details]
	@ApprovalRequestId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Content,
		ReviewStatus
	FROM ApprovalRequest 
	WHERE 
		Id=@ApprovalRequestId AND
		TableName = N'Customer'
END
