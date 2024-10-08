CREATE OR ALTER PROCEDURE [dbo].[userinfo_location_details_for_report]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
   SELECT
        T.RegionId,
        UI.TenantOfficeId,
		MED.Code AS UserCategoryCode
    FROM UserInfo UI
        LEFT JOIN TenantOffice T ON T.Id = UI.TenantOfficeId
		LEFT JOIN MasterEntityData MED ON MED.Id = UI.UserCategoryId
    WHERE
        UI.Id = @UserId;
END