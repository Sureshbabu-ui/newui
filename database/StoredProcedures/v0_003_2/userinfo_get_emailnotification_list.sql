CREATE OR ALTER PROCEDURE [dbo].[userinfo_get_emailnotification_list]
  @TenantOfficeId INT,
  @EventCode VARCHAR(8)
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		UI.FullName,
		UI.Email
	FROM 
		BusinessEvent BE
		INNER JOIN NotificationSetting NS ON BE.Id = NS.BusinessEventId
		INNER JOIN UserRole UR ON NS.RoleId = UR.RoleId
		INNER JOIN UserInfo UI ON UR.UserId = UI.Id
        INNER JOIN TenantOffice ON TenantOffice.Id = UI.TenantOfficeId
		INNER JOIN TenantRegion TR ON TR.Id =TenantOffice.RegionId
        INNER JOIN MasterEntityData  UserCategory ON UI.UserCategoryId = UserCategory.Id
	WHere
		BE.Code = @EventCode AND NS.Email = 1
		   AND (
            UserCategory.Code = 'UCT_FRHO'
            OR (UserCategory.Code = 'UCT_CPTV' AND @TenantOfficeId = UI.TenantOfficeId)
            OR (UserCategory.Code = 'UCT_FRRO' AND TenantOffice.RegionId = TR.Id)
        )
END 