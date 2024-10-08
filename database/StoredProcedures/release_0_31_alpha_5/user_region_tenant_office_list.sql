CREATE OR ALTER   PROCEDURE [dbo].[user_region_tenant_office_list]
	 @UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;
	DECLARE @OfficeTypeId INT;

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
		T.OfficeName
	FROM TenantOffice T
		LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
	WHERE (TOI.EffectiveTo IS NULL) AND 
	TOI.IsVerified = 1 AND 
	(
        @UserCategory = 'UCT_FRHO'
        OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id)
        OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
    ) AND
	T.OfficeTypeId=@OfficeTypeId
END 