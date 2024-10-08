CREATE OR ALTER PROCEDURE [dbo].[notificationsetting_eventwise_list]
  @BusinessEventId INT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT 
        ISNULL(NS.Id, 0) AS Id,
        @BusinessEventId AS BusinessEventId,
        ISNULL(NS.Email, 0) AS Email,
        R.Id AS RoleId,
        R.[Name] AS [Name]
    FROM [Role] R
    LEFT JOIN NotificationSetting NS ON NS.RoleId = R.Id  AND  NS.BusinessEventId = @BusinessEventId
    WHERE
        R.IsActive = 1 
		ORDER BY R.[Name] asc
END 