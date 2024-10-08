CREATE OR ALTER PROCEDURE [dbo].[tenantoffice_region_and_category_wise_list]
	@RegionId INT,
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
		T.Id,
		T.OfficeName,
		TOI.Address
	FROM TenantOffice T
		LEFT JOIN TenantOfficeInfo TOI ON  TOI.TenantOfficeId =T.Id AND TOI.EffectiveTo IS NULL
	WHERE (TOI.EffectiveTo IS NULL) AND 
	TOI.IsVerified = 1 AND 
	(
        @UserCategory = 'UCT_FRHO' AND (T.RegionId = @RegionId OR @RegionId IS NULL )
        OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id)
        OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
    ) AND
	T.OfficeTypeId=@OfficeTypeId
END 
