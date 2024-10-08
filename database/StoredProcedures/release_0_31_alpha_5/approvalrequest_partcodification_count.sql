CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_partcodification_count]
    @Search     VARCHAR(50) = NULL,
	@UserInfoId INT,
	@TableName VARCHAR(16) = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(AR.Id)
	FROM 
	    ApprovalRequest AR
	WHERE 
		(@TableName IS NULL OR 
        AR.TableName = @TableName) AND
		AR.CreatedBy =@UserInfoId
END