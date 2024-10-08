CREATE OR ALTER PROCEDURE [dbo].[selected_user_roles] 
    @UserId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        UR.RoleId AS UserRoles,
        R.[Name] AS RoleNames
    FROM UserInfo U
        LEFT JOIN UserRole UR ON U.Id = UR.UserId
        LEFT JOIN [Role] R ON UR.RoleId = R.Id
    WHERE
        U.Id = @UserId
    GROUP BY
        UR.RoleId,
        R.[Name]
END 