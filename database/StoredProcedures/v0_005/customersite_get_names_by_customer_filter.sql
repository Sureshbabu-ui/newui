CREATE OR ALTER  PROCEDURE [dbo].[customersite_get_names_by_customer_filter]
	@ContractId INT = NULL,
	@UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @OfficeTypeId INT;
	DECLARE @UserRegionId INT;

	SELECT	@OfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_AROF'

	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = TenantOfficeId,
		@UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	SELECT 
		CS.Id,
		CS.SiteName
	FROM  CustomerSite CS
	LEFT JOIN ContractCustomerSite CCS ON CCS.CustomerSiteId = CS.Id
	LEFT JOIN [Contract]   ON Contract.Id = CCS.ContractId
	LEFT JOIN Customer C ON  CS.CustomerId = C.Id
	LEFT JOIN CustomerInfo CI ON CI.CustomerId = C.Id AND CI.EffectiveTo IS NULL
	LEFT JOIN TenantOffice T ON T.Id = CS.TenantOfficeId  OR Contract.TenantOfficeId =T.Id
	LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId AND TOI.EffectiveTo IS NULL
    WHERE 	TOI.IsVerified = 1 AND 
	(@ContractId IS NULL OR @ContractId = [Contract].Id)

	AND
	(
        (@UserCategory = 'UCT_FRHO' )
        OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id )
        OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
    ) AND
	T.OfficeTypeId=@OfficeTypeId AND
	ContractNumber IS NOT NULL
END 
