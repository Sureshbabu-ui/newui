CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_partcodification_list]
	@Page INT = 1,
	@PerPage INT = 10,
	@Search varchar(50) = NULL,
	@TableName VARCHAR(16) = NULL,
	@UserInfoId INT
AS
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
	SET @Page = 1;
    SELECT 
        AR.Id, 
        AR.Content,
        AR.TableName,
        AR.ReviewComment,
        ReviewStatus.Code AS ReviewStatus,
		ReviewStatus.[Name] AS ReviewStatusName,
        AR.CreatedBy,
        AR.CreatedOn ,
        CU.FullName AS CreatedUserName, 
        RU.FullName AS ReviewedUserName 
    FROM ApprovalRequest AR
    LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
    LEFT JOIN UserInfo RU ON AR.ReviewedBy = RU.Id 
    INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = AR.ReviewStatus
	WHERE
		(@TableName IS NULL OR 
        AR.TableName = @TableName) AND
		AR.CreatedBy =@UserInfoId
	ORDER BY AR.Id DESC
	OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END