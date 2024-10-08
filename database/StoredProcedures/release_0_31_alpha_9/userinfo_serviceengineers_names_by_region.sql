CREATE OR ALTER   PROCEDURE [dbo].[userinfo_serviceengineers_names_by_region]
	@UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserRegionId INT;
 
	SELECT
        @UserCategory = MED.Code,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;
 
	SELECT 
		U.Id,
		FullName,
		SEI.[Address]
	FROM UserInfo U
		LEFT JOIN UserRole ON UserRole.UserId = U.Id
		LEFT JOIN [Role] R ON R.Id = UserRole.RoleId
		LEFT JOIN TenantOffice T ON T.Id = U.TenantOfficeId
		LEFT JOIN ServiceEngineerInfo SEI ON SEI.UserInfoId = U.Id
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
	WHERE 
		U.IsDeleted = 0 AND
	    R.Code = 'SE' AND
		(
        @UserCategory = 'UCT_FRHO'
        OR (@UserCategory = 'UCT_CPTV' AND TenantRegion.Id = @UserRegionId)
        OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
		)
END