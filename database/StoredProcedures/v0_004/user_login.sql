CREATE  OR ALTER PROCEDURE [dbo].[user_login]
    @Username   VARCHAR(64)
AS
BEGIN
SET NOCOUNT ON;
    DECLARE @MobesurePermittedRoles varchar(64)
    DECLARE @BesureRestrictedRoles varchar(64)
    SELECT @MobesurePermittedRoles = AppValue From AppSetting WHERE AppKey = 'MobesurePermittedRoles'
    SELECT @BesureRestrictedRoles = AppValue From AppSetting WHERE AppKey = 'BesureRestrictedRoles'
    SELECT
        UserLogin.Id,
        UserLogin.Passcode,
        UserLogin.IsActive,
        UserLogin.TotalFailedLoginAttempts,
        CASE
            WHEN UserInfo.ExpiryDate < GETDATE()
            THEN 1
            ELSE 0
        END AS IsUserExpired,
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM UserRole UR
                INNER JOIN [Role] R ON UR.RoleId = R.Id
                INNER JOIN UserInfo UI ON UI.Id = UR.UserId
                INNER JOIN UserLogin UL ON UI.UserLoginId = UL.Id
                WHERE UL.Username = @Username AND
                R.[Code] IN (SELECT value FROM STRING_SPLIT(@MobesurePermittedRoles, ',')) AND  
                R.IsActive = 1
            )
            THEN 1
            ELSE 0
        END AS HasServiceEngineerRole,
        CASE
        WHEN EXISTS (
            SELECT 1
            FROM UserRole UR
            INNER JOIN [Role] R ON UR.RoleId = R.Id
            INNER JOIN UserInfo UI ON UI.Id = UR.UserId
            INNER JOIN UserLogin UL ON UI.UserLoginId = UL.Id
            WHERE UL.Username = @Username AND
            R.[Code] NOT IN (SELECT value FROM STRING_SPLIT(@BesureRestrictedRoles, ',')) AND  
            R.IsActive = 1
        )
        THEN 1
        ELSE 0
    END AS HasBesurePermission
    FROM
        UserLogin
        INNER JOIN UserInfo ON UserInfo.UserLoginId = UserLogin.Id
    WHERE
        UserLogin.Username=@Username
END