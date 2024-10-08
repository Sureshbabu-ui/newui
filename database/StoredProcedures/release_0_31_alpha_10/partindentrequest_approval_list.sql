CREATE OR ALTER PROCEDURE [dbo].[partindentrequest_approval_list]
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL,
	@AssetProductCategoryId INT = NULL
AS
BEGIN 
	SET NOCOUNT ON;

	IF @Page < 1
	SET
	@Page = 1;
    SELECT 
        PIR.Id,
		PIR.IndentRequestNumber,
		RequestedBy.FullName AS RequestedBy,
		PIR.Remarks,
		APC.CategoryName,
		SUM(CASE WHEN PartRequestStatus.Code = 'PRT_CRTD' THEN 1 ELSE 0 END) AS CreatedRequestCount,
		SUM(CASE WHEN PartRequestStatus.Code IN ('PRT_APRV','PRT_DESP','PRT_HOLD','PRT_TRNS','PRT_RCVD') THEN 1 ELSE 0 END) AS ApprovedRequestCount,
		SUM(CASE WHEN PartRequestStatus.Code = 'PRT_RJTD' THEN 1 ELSE 0 END) AS RejectedRequestCount,
		PIR.IsProcessed,
		PIR.CreatedOn,
		T.OfficeName AS [Location]
	FROM 
        PartIndentRequest AS PIR
		INNER JOIN PartIndentRequestDetail AS PIRD ON PIR.Id=PIRD.PartIndentRequestId
		INNER JOIN UserInfo AS RequestedBy ON RequestedBy.Id = PIR.RequestedBy
		INNER JOIN MasterEntityData AS PartRequestStatus ON PartRequestStatus.Id = PIRD.RequestStatusId
		INNER JOIN TenantOffice T ON PIR.TenantOfficeId = T.Id
		INNER JOIN AssetProductCategory APC ON APC.Id = PIR.AssetProductCategoryId
	    WHERE
		(@AssetProductCategoryId IS NULL OR PIR.AssetProductCategoryId = @AssetProductCategoryId) AND
        (ISNULL(@Search, '') = '' OR PIR.IndentRequestNumber LIKE '%' + @Search + '%') AND 
		PIR.IsProcessed = 0
	GROUP BY 
		PIR.Id,
		PIR.IndentRequestNumber,
		PIR.CreatedOn,
		RequestedBy.FullName,
		PIR.Remarks,	
		PIR.IsProcessed,
		T.OfficeName,
		APC.CategoryName
    ORDER BY PIR.Id Desc
	OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END