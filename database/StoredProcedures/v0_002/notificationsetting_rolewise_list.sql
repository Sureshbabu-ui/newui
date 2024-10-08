CREATE OR ALTER PROCEDURE [dbo].[notificationsetting_rolewise_list]
  @RoleId INT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT 
        ISNULL(NS.Id, 0) AS Id,
        @RoleId AS RoleId,
        ISNULL(NS.Email, 0) AS Email,
        BE.Id AS BusinessEventId,
        BE.[Name] AS [Name]
    FROM BusinessEvent BE
    LEFT JOIN NotificationSetting NS ON NS.BusinessEventId = BE.Id  AND NS.RoleId = @RoleId             
    WHERE
        BE.IsActive = 1 
		ORDER BY BE.[Name] asc
END