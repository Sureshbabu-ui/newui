CREATE OR ALTER   PROCEDURE [dbo].[user_get_all_names]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, FullName FROM UserInfo
END;
