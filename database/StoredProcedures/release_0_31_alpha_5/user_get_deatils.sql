 CREATE OR ALTER PROCEDURE [dbo].[user_get_details]
    @EmployeeCode VARCHAR(100)
AS
    BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id, 
		Email,
		FullName 
	FROM UserInfo 
	WHERE 
		EmployeeCode=@EmployeeCode AND 
		IsActive=1 AND 
		IsDeleted=0
END