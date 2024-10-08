CREATE OR ALTER  PROCEDURE [dbo].[tenantregion_usercategory_getnames]
	@UserId INT
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;
	DECLARE @OfficeTypeId INT;

	SELECT
        @UserCategory = MED.Code,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
        INNER JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	SELECT 
		Id,
		RegionName,
		Code 
	FROM 
		TenantRegion 
	WHERE 
		IsActive=1 AND
		(
			@UserCategory = 'UCT_FRHO' OR 
			@UserCategory = 'UCT_CPTV' AND TenantRegion.Id = @UserRegionId OR 
			@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId
		)
END 
