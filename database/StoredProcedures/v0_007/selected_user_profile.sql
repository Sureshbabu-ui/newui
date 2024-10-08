CREATE OR ALTER   PROCEDURE [dbo].[selected_user_profile] 
	@UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		UI.Id,
		UI.FullName,
		UI.Email,
		UI.Phone,
		UI.CreatedOn,
		UI.EmployeeCode,
		ET.[Name] AS EngagementType,
		D.[Name] AS Designation,
		D.Code AS DesignationCode,
		DE.[Name] AS Department,
		UG.[Name] AS UserGrade,
		DI.[Name] AS Division,
		SEI.EngineerGeolocation,
		SEI.[Address] AS EngineerHomeLocation,
		SEET.[Name] AS ServiceEngineerType,
		SEEL.[Name] AS ServiceEngineerLevel,
		SEEC.[Name] AS ServiceEngineerCategory,
		UC.[Name] AS UserCategory,
		TenantOffice.OfficeName AS Location,
		(STUFF((select distinct ', ' + MED.[Name]
          FROM UserBusinessUnit UBU
		  INNER JOIN MasterEntityData MED ON MED.Id = UBU.BusinessUnitId
          WHERE UBU.UserId = @UserId
          for xml path(''), TYPE).value('(./text())[1]', 'NVARCHAR(MAX)'),1,1,'')
		) AS BusinessUnits,
		UI.DocumentUrl,
		UI.IsActive
	FROM
		UserInfo UI
		LEFT JOIN MasterEntityData DE ON DE.Id= UI.DepartmentId
		LEFT JOIN MasterEntityData ET ON ET.Id= UI.EngagementTypeId
		LEFT JOIN MasterEntityData UC ON UC.Id= UI.UserCategoryId
		LEFT JOIN Division DI ON DI.Id= UI.DivisionId
		LEFT JOIN Designation D ON D.Id= UI.DesignationId
		LEFT JOIN ServiceEngineerInfo SEI ON SEI.UserInfoId = UI.Id 
		LEFT JOIN MasterEntityData SEET ON SEET.Id = SEI.EngineerType
		LEFT JOIN MasterEntityData SEEL ON SEEL.Id = SEI.EngineerLevel
		LEFT JOIN MasterEntityData SEEC ON SEEC.Id = SEI.EngineerCategory
		LEFT JOIN TenantOffice ON TenantOffice.Id = UI.TenantOfficeId
		LEFT JOIN MasterEntityData UG ON UG.Id= UI.UserGradeId
WHERE
		UI.Id = @UserId
END 
