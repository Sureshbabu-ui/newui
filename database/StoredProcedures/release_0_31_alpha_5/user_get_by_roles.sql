CREATE OR ALTER PROCEDURE [dbo].[user_get_by_roles]
    @TenantOfficeId INT,
    @Role VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserRegionId INT;
	
	SELECT @UserRegionId = RegionId FROM TenantOffice WHERE TenantOffice.Id = @TenantOfficeId

    SELECT 
        UserInfo.Id, 
        UserInfo.FullName
    FROM UserInfo
    LEFT JOIN UserRole ON UserRole.UserId = UserInfo.Id
    LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
    LEFT JOIN Role ON Role.Id = UserRole.RoleId
    LEFT JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        Role.Code IN (SELECT [value] FROM OPENJSON(@Role))
        AND (
            UserCategory.Code = 'UCT_FRHO'
			OR (UserCategory.Code = 'UCT_CPTV' AND TenantOfficeId = @TenantOfficeId)
			OR (UserCategory.Code = 'UCT_FRRO' AND TenantOffice.RegionId= @UserRegionId)
        )
END
