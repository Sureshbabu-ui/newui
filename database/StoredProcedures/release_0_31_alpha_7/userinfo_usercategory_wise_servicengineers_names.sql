CREATE OR ALTER PROCEDURE [dbo].[userinfo_usercategory_wise_servicengineers_names]
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
        @UserOfficeId = UserInfo.TenantOfficeId,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	SELECT 
		U.Id,
		FullName,
		T.RegionId
	FROM UserInfo U
		LEFT JOIN UserRole ON UserRole.UserId = U.Id
		LEFT JOIN [Role] R ON R.Id = UserRole.RoleId
		LEFT JOIN TenantOffice T ON T.Id = U.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
	WHERE 
		U.IsDeleted = 0 AND
	    R.Code = 'SE' AND
		(
        @UserCategory = 'UCT_FRHO'
        OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id)
        OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
		)
END