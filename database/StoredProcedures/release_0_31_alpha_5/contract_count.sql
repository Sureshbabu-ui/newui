CREATE OR ALTER PROCEDURE [dbo].[contract_count]
	@Filters       	VARCHAR(1024)=NULL,
	@TotalRows   	INT OUTPUT,
	@ContractStatus VARCHAR(8) = NULL,
	@SearchWith VARCHAR(64) = NULL,
	@UserInfoId INT
AS 
BEGIN
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;
	DECLARE @ContractStatusId INT;
	SELECT @ContractStatusId = Id FROM MasterEntityData WHERE Code = @ContractStatus
	SELECT
		@UserCategory = UserCategory.Code,
		@UserOfficeId = TenantOfficeId,
		@UserRegionId = RegionId
	FROM UserInfo
	LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
	LEFT JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
	WHERE 
		UserInfo.Id = @UserInfoId;

DECLARE @StartDate varchar(64)
DECLARE @EndDate varchar(64)
DECLARE @SearchText varchar(64)
	SET NOCOUNT ON;
	SELECT    @StartDate = JSON_VALUE(@Filters, '$.StartDate'),
			  @EndDate = JSON_VALUE(@Filters, '$.EndDate'),
			  @SearchText= JSON_VALUE(@Filters, '$.SearchText')
 IF (@Filters IS NULL)	
	SELECT	@TotalRows=COUNT([Contract].Id) 	
	FROM [Contract]
	INNER JOIN MasterEntityData AS ContractStatus ON [Contract].ContractStatusId = ContractStatus.Id
	LEFT JOIN TenantOffice ON TenantOffice.Id = [Contract].TenantOfficeId
    LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
	WHERE
		(@UserCategory = 'UCT_FRHO' OR
		(@UserCategory = 'UCT_CPTV' AND 
		@UserOfficeId = [Contract].TenantOfficeId) OR
		(@UserCategory = 'UCT_FRRO' AND 
		TenantRegion.Id = @UserRegionId))	   
	AND
		[Contract].ContractStatusId = @ContractStatusId	
	ELSE		
		SELECT	
			@TotalRows=COUNT([Contract].Id) 	
		FROM [Contract]
		LEFT JOIN CustomerInfo ON [Contract].CustomerInfoId = CustomerInfo.Id
		INNER JOIN MasterEntityData AS ContractStatus ON [Contract].ContractStatusId = ContractStatus.Id
		LEFT JOIN TenantOffice ON TenantOffice.Id = [Contract].TenantOfficeId
        LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
		WHERE
		(@UserCategory = 'UCT_FRHO'
		OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = [Contract].TenantOfficeId)
		OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)) AND
			(@SearchWith='CustomerName' AND CustomerInfo.[Name] LIKE '%' + @SearchText + '%')
        OR (@SearchWith='ContractNumber' AND [Contract].ContractNumber LIKE '%' + @SearchText + '%')
        OR (@SearchWith='ContractExpiredBetween' AND  EndDate BETWEEN @StartDate AND @EndDate )
		OR (@SearchWith='ContractBookedBetween' AND  StartDate BETWEEN @StartDate AND @EndDate );
END