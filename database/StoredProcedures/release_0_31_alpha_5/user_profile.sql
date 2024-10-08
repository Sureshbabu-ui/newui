CREATE OR ALTER     PROCEDURE [dbo].[user_profile]
    @UserInfoId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        UI.FullName,
        UI.Email,
        UI.Phone,
        UI.CreatedOn,
        UI.Id,
        UI.EmployeeCode,
		ET.[Name] AS EngagementType,
		Designation.[Name] AS Designation,
		D.[Name] AS Department,
		Division.[Name] AS Division,
		UC.[Name] AS UserCategory,
        STUFF
                ((SELECT DISTINCT ',' + BF.BusinessFunctionCode
                FROM UserInfo UI2
                LEFT JOIN UserRole UR2 ON UI2.Id = UR2.UserId
                LEFT JOIN [Role] ON [Role].Id = UR2.RoleId 
                LEFT JOIN RoleBusinessFunctionPermission RBP ON UR2.RoleId = RBP.RoleId
                LEFT JOIN BusinessFunction BF ON RBP.BusinessFunctionId = BF.Id AND BF.IsActive = 1
                WHERE 
					UI2.Id = @UserInfoId AND 
					UI2.IsDeleted = 0 AND 
					[Role].IsActive = 1
                FOR XML PATH('')
            ), 1, 1, '') AS [Permissions]
    FROM UserInfo UI
    LEFT JOIN UserRole UR ON UI.Id = UR.UserId
    LEFT JOIN [Role] ON [Role].Id = UR.RoleId
    LEFT JOIN RoleBusinessFunctionPermission RBP ON UR.RoleId = RBP.RoleId
    LEFT JOIN BusinessFunction BF ON RBP.BusinessFunctionId = BF.Id AND BF.IsActive = 1
	LEFT JOIN MasterEntityData D ON D.Id= UI.DepartmentId
	LEFT JOIN MasterEntityData ET ON ET.Id= UI.EngagementTypeId
	LEFT JOIN MasterEntityData UC ON UC.Id= UI.UserCategoryId
	LEFT JOIN Division ON Division.Id= UI.DivisionId
	LEFT JOIN Designation ON Designation.Id= UI.DesignationId
    WHERE 
		UI.Id = @UserInfoId AND 
		[Role].IsActive = 1 
	GROUP BY 
		UI.FullName, 
		UI.Email, 
		UI.Phone, 
		UI.CreatedOn, 
		UI.Id, 
		UI.EmployeeCode,
		ET.[Name],
		Designation.[Name],
		D.[Name],
		Division.[Name],
		UC.[Name];
END
