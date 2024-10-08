
CREATE OR ALTER PROCEDURE [dbo].[user_exists_check]
    @EmployeeCode VARCHAR(32),
    @UserCount INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	IF( 0 = (SELECT Count(Id) FROM UserInfo WHERE EmployeeCode=@EmployeeCode ))
        SET @UserCount = 0
    ELSE
        SET @UserCount = 1
END 

