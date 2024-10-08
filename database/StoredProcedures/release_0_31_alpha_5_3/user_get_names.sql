CREATE OR ALTER PROCEDURE [dbo].[user_get_names]
AS
BEGIN
  
    SET NOCOUNT ON;

    SELECT Id, FullName FROM UserInfo
	WHERE IsActive = 1 AND IsDeleted = 0
END;