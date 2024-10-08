CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_interim_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
	@IsAssetRequest BIT = NULL,
	@IsFinanceRequest BIT = NULL,
    @SearchWith VARCHAR(64) = NULL,
    @Filters VARCHAR(1024) = NULL
AS
BEGIN 
SET NOCOUNT ON;
	DECLARE @CaseStatusId INT;
	DECLARE @StartDate varchar(64)
    DECLARE @EndDate varchar(64)
    DECLARE @SearchText varchar(64)
	DECLARE @InterimAssetStatusId INT;

	SELECT @InterimAssetStatusId = Id FROM MasterEntityData WHERE Code = 'IAS_APRV'

    SELECT 
        @StartDate = JSON_VALUE(@Filters, '$.StartDate'),
        @EndDate = JSON_VALUE(@Filters, '$.EndDate'),
        @SearchText= JSON_VALUE(@Filters, '$.SearchText')

	SELECT @CaseStatusId = Id From MasterEntityData WHERE Code = 'SRS_CLSD'

    IF @Page < 1
    SET @Page = 1;
    SELECT 
		SR.Id,
        SR.CaseId,
		CustomerInfo.[Name] AS CustomerName,
		SR.EndUserPhone,
		Contract.ContractNumber,
        SR.EndUserPhone,
		Product.ModelName,
		PC.CategoryName,
		COALESCE(CIA.ProductSerialNumber,A.ProductSerialNumber) AS ProductSerialNumber,
		CustomerSite.SiteName,
        SR.CaseReportedOn,
		SR.CreatedOn,
		ISNULL(NULLIF(SR.CustomerServiceAddress, ''), CustomerSite.[Address]) AS CustomerServiceAddress,
		CallStatus.[Name] AS Status,
		CallSource.[Name] AS CallSource,
		CallStatus.Code AS StatusCode
    FROM 
        ServiceRequest AS SR
		LEFT JOIN Contract ON Contract.Id = SR.ContractId
		LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId
		LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
		LEFT JOIN Asset AS A ON A.Id = CAD.AssetId
		LEFT JOIN ContractInterimAsset AS CIA ON CIA.Id = SR.ContractInterimAssetId
		LEFT JOIN CustomerSite ON CustomerSite.Id = SR.CustomerSiteId
		LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		LEFT JOIN MasterEntityData AS CallSource ON SR.CallSourceId = CallSource.Id
		LEFT JOIN Product ON Product.Id = COALESCE(CIA.ProductModelId,A.ProductModelId)
		LEFT JOIN AssetProductCategory AS PC ON PC.Id = COALESCE(CIA.AssetProductCategoryId,A.AssetProductCategoryId)
	WHERE
		((@IsAssetRequest = 1 AND SR.IsInterimCaseAssetApprovalNeeded = 1 AND  SR.InterimCaseAssetApprovedBy IS NULL)
		OR (@IsFinanceRequest = 1 AND SR.IsInterimCaseFinanceApprovalNeeded = 1 AND SR.InterimCaseFinanceAprovedBy IS NULL)) AND
		(SR.IsInterimCaseId = 1 AND CaseStatusId != @CaseStatusId) AND
		((@SearchWith IS NULL OR @SearchWith = '') OR 
		(@SearchWith = 'CallType' AND CallSource.[Name] LIKE '%' +@SearchText+ '%') OR
		(@SearchWith = 'CaseId' AND SR.CaseId LIKE '%' +@SearchText+ '%') OR
		(@SearchWith = 'EndUserPhone' AND SR.EndUserPhone LIKE '%' +@SearchText+ '%') OR
		(@SearchWith = 'CallLodgedDateBetween' AND SR.CaseReportedOn BETWEEN @StartDate AND @EndDate))
		ORDER BY 
			SR.Id DESC 
		OFFSET 
			(@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END