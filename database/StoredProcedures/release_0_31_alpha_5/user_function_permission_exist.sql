CREATE OR ALTER PROCEDURE [dbo].[user_function_permission_exist]
    @UserId INT,
    @BusinessFunctionCode VARCHAR(36),
	@IsGranted  BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Permissions NVARCHAR(MAX);
    SELECT @Permissions = STUFF(
               (SELECT DISTINCT ',' + BF.BusinessFunctionCode
                FROM UserInfo AS UI
                LEFT JOIN UserRole AS UR2 ON UI.Id = UR2.UserId
                LEFT JOIN Role ON Role.Id = UR2.RoleId 
                LEFT JOIN RoleBusinessFunctionPermission AS RBP ON UR2.RoleId = RBP.RoleId
                LEFT JOIN BusinessFunction AS BF ON RBP.BusinessFunctionId = BF.Id AND BF.IsActive = 1
                WHERE UI.Id = @UserId AND UI.IsDeleted = 0 AND Role.IsActive = 1
            FOR XML PATH('')
        ), 1, 1, '')
   
    SET @IsGranted = CASE WHEN CHARINDEX(@BusinessFunctionCode, @Permissions) > 0 THEN 1 ELSE 0 END;
  SELECT @Permissions     
END