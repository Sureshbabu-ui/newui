CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_interim_count]
    @SearchWith VARCHAR(64) = NULL,
	@IsAssetRequest BIT = NULL,
	@IsFinanceRequest BIT = NULL,
    @Filters VARCHAR(1024) = NULL,
    @TotalRows  INT OUTPUT
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
    SELECT 
        @TotalRows = COUNT(SR.Id)
    FROM 
        ServiceRequest AS SR
		LEFT JOIN Contract ON Contract.Id = SR.ContractId
		LEFT JOIN ContractInterimAsset AS CIA ON CIA.Id = SR.ContractInterimAssetId
		LEFT JOIN MasterEntityData AS CallSource ON SR.CallSourceId = CallSource.Id
	WHERE
		((@IsAssetRequest = 1 AND SR.IsInterimCaseAssetApprovalNeeded = 1 AND  SR.InterimCaseAssetApprovedBy IS NULL)
		OR (@IsFinanceRequest = 1 AND SR.IsInterimCaseFinanceApprovalNeeded = 1 AND SR.InterimCaseFinanceAprovedBy IS NULL)) AND
		(SR.IsInterimCaseId = 1 AND CaseStatusId != @CaseStatusId) AND
		((@SearchWith IS NULL OR @SearchWith = '') OR 
		(@SearchWith = 'CallType' AND CallSource.[Name] LIKE '%' +@SearchText+ '%') OR
		(@SearchWith = 'CaseId' AND SR.CaseId LIKE '%' +@SearchText+ '%') OR
		(@SearchWith = 'EndUserPhone' AND SR.EndUserPhone LIKE '%' +@SearchText+ '%') OR
		(@SearchWith = 'CallLodgedDateBetween' AND SR.CaseReportedOn BETWEEN @StartDate AND @EndDate))
END