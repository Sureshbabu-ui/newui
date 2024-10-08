CREATE OR ALTER     PROCEDURE [dbo].[approvalrequest_user_detail]
    @ApprovalRequestDetailId INT
AS
BEGIN 
    SET NOCOUNT ON;   
    SELECT 
        GETUTCDATE() AS FetchTime,
        ARD.Id,
        AR.CaseId,
		AE.EventCode TableName,
        AR.Content,
		JSON_VALUE(AR.Content, '$.EmployeeCode') EmployeeCode,
		JSON_VALUE(AR.Content, '$.FullName') FullName,
		JSON_VALUE(AR.Content, '$.Email') Email,
		JSON_VALUE(AR.Content, '$.Phone') Phone,
		JSON_VALUE(AR.Content, '$.BudgetedAmount') BudgetedAmount,
		JSON_VALUE(AR.Content, '$.CustomerAgreedAmount') CustomerAgreedAmount,
		JSON_VALUE(AR.Content, '$.StartDate') StartDate,	
		JSON_VALUE(AR.Content, '$.EndDate') EndDate,
		JSON_VALUE(AR.Content, '$.EngineerPincode') EngineerPincode,	
		JSON_VALUE(AR.Content, '$.EngineerGeolocation') EngineerGeolocation,
		JSON_VALUE(AR.Content, '$.EngineerAddress') EngineerAddress,
		UC.[Name] AS UserCategory,	
		DI.[Name] AS Division,
		DE.[Name] AS Department,
		ET.[Name] AS EngagementType,
		G.[Name] AS Gender,
		D.[Name] AS Designation,
		RM.FullName AS ReportingManager,
		TenantOffice.OfficeName AS Location,
		SEET.[Name] AS ServiceEngineerType,
		SEEL.[Name] AS ServiceEngineerLevel,
		SEEC.[Name] AS ServiceEngineerCategory,
		UG.[Name] AS UserGrade,
		Country.[Name] AS Country,
		[State].[Name] AS [State],
		City.[Name] AS City,
        RS.Code AS ReviewStatus,
		RS.[Name] AS ReviewStatusName,
        ARD.ReviewComment,
        AR.CreatedOn,
        AR.CreatedBy,
        ARD.ReviewedBy,
        ARD.ReviewedOn, 
        CU.FullName AS CreatedUserName, 
		RU.FullName AS ReviewedUserName,
		(SELECT STUFF(
						(SELECT ',' + [Role].Name
						 FROM [Role]
						 INNER JOIN ApprovalRequest AR2 ON AR2.Id = AR.Id
						 CROSS APPLY STRING_SPLIT(JSON_VALUE(AR2.Content, '$.UserRoles'), ',') AS SplitRoles
						 WHERE [Role].Id = SplitRoles.value
						 FOR XML PATH(''), TYPE
						).value('.', 'NVARCHAR(MAX)'), 1, 1, '')) AS UserRole,
		JSON_VALUE(AR.Content, '$.DocumentUrl') AS DocumentUrl ,
		CustomerInfo.NameOnPrint AS CustomerName,
		Contract.ContractNumber AS ContractNumber,
		CustomerSite.SiteName AS CustomerSite
		FROM ApprovalRequestDetail ARD
		INNER JOIN ApprovalRequest AR ON AR.Id =ARD.ApprovalRequestId
		INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	    INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
		INNER JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
		LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
		LEFT JOIN UserInfo RU ON ARD.ReviewedBy = RU.Id
		LEFT JOIN MasterEntityData RS ON RS.Id = ARD.ReviewStatusId
		LEFT JOIN MasterEntityData UC ON UC.Id= JSON_VALUE(AR.Content, '$.UserCategoryId')
		LEFT JOIN Division DI ON DI.Id= JSON_VALUE(AR.Content, '$.DivisionId')
		LEFT JOIN MasterEntityData DE ON DE.Id= JSON_VALUE(AR.Content, '$.DepartmentId')
		LEFT JOIN MasterEntityData ET ON ET.Id= JSON_VALUE(AR.Content, '$.EngagementTypeId')
		LEFT JOIN MasterEntityData G ON G.Id= JSON_VALUE(AR.Content, '$.GenderId')
		LEFT JOIN Designation D ON D.Id= JSON_VALUE(AR.Content, '$.DesignationId')
		LEFT JOIN UserInfo RM ON RM.Id = JSON_VALUE(AR.Content, '$.ReportingManagerId')
		LEFT JOIN TenantOffice ON TenantOffice.Id = JSON_VALUE(AR.Content, '$.TenantOfficeId')
		LEFT JOIN MasterEntityData SEET ON SEET.Id = JSON_VALUE(AR.Content, '$.EngineerType')
		LEFT JOIN MasterEntityData SEEL ON SEEL.Id = JSON_VALUE(AR.Content, '$.EngineerLevel')
		LEFT JOIN MasterEntityData SEEC ON SEEC.Id = JSON_VALUE(AR.Content, '$.EngineerCategory')
		LEFT JOIN Country ON Country.Id = JSON_VALUE(AR.Content, '$.EngineerCountryId')
		LEFT JOIN [State] ON [State].Id = JSON_VALUE(AR.Content, '$.EngineerStateId')
		LEFT JOIN City ON City.Id = JSON_VALUE(AR.Content, '$.EngineerCityId')
		LEFT JOIN Contract ON Contract.Id = JSON_VALUE(AR.Content, '$.ContractId')
		LEFT JOIN CustomerInfo ON CustomerInfo.Id = Contract.CustomerInfoId
		LEFT JOIN CustomerSite ON CustomerSite.Id = JSON_VALUE(AR.Content, '$.CustomerSiteId')
		LEFT JOIN MasterEntityData UG ON UG.Id= JSON_VALUE(AR.Content, '$.UserGradeId')
    WHERE 
        ARD.Id = @ApprovalRequestDetailId;
END

