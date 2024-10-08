CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_part_detail]
    @ApprovalRequestId INT,
    @TableName VARCHAR(16)
AS
BEGIN 
    SET NOCOUNT ON;
    
    SELECT 
        GETUTCDATE() AS 'FetchTime',
        AR.Id,
        AR.CaseId,
		AR.TableName,
        AR.Content,
		PC.CategoryName AS ProductCategoryName,
		PTC.[Name] AS PartCategoryName,	
		PSC.[Name] AS PartSubCategoryName,
		M.[Name] AS MakeName,
        AR.ReviewedOn, 
        RS.Code AS ReviewStatus,
        AR.ReviewComment,
        AR.CreatedOn,
        AR.CreatedBy,
        AR.ReviewedBy,
        AR.UpdatedOn, 
        CU.FullName AS CreatedUserName, 
        RU.FullName AS ReviewedUserName 
    FROM ApprovalRequest AR
    LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
    LEFT JOIN UserInfo RU ON AR.ReviewedBy = RU.Id
    LEFT JOIN PartProductCategory PC ON PC.Id = JSON_VALUE(AR.Content, '$.ProductCategoryId') 
    LEFT JOIN PartCategory PTC ON PTC.Id = JSON_VALUE(AR.Content, '$.PartCategoryId')
	LEFT JOIN PartSubCategory PSC ON PSC.Id = JSON_VALUE(AR.Content, '$.PartSubCategoryId')
LEFT JOIN Make M ON M.Id = JSON_VALUE(AR.Content, '$.MakeId')
    LEFT JOIN MasterEntityData RS ON RS.Id = AR.ReviewStatus
    WHERE 
        AR.Id = @ApprovalRequestId;
END
