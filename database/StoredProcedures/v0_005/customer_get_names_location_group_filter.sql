CREATE OR ALTER  PROCEDURE [dbo].[customer_get_names_location_group_filter]
	@TenantOfficeId INT =NULL,
	@CustomerGroupId INT = NULL,
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
		DISTINCT C.Id,
		CI.NameOnPrint
	FROM Customer C
	LEFT JOIN CustomerInfo CI ON CI.CustomerId = C.Id AND CI.EffectiveTo IS NULL
	LEFT JOIN CustomerSite CS ON CS.CustomerId = C.Id
	LEFT JOIN TenantOffice T ON T.Id = CI.TenantOfficeId OR T.Id = CS.TenantOfficeId
	LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId AND TOI.EffectiveTo IS NULL
    WHERE 	TOI.IsVerified = 1 AND 
	(@TenantOfficeId IS NULL OR @TenantOfficeId = T.Id) AND
    (@CustomerGroupId IS NULL OR @CustomerGroupId = CI.CustomerGroupId)
	AND
	(
        (@UserCategory = 'UCT_FRHO' )
        OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id )
        OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
    ) AND
	T.OfficeTypeId=@OfficeTypeId
END 
