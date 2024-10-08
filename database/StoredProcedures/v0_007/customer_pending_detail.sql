CREATE OR ALTER PROCEDURE [dbo].[customer_pending_detail]
    @ApprovalRequestId INT
AS
BEGIN 
    SET NOCOUNT ON;   
    SELECT 
        GETUTCDATE() AS FetchTime,
		AR.Id,
        AR.CaseId,
		AE.EventCode TableName,
		GETUTCDATE() AS FetchTime,
		JSON_VALUE(AR.Content, '$.Name') [Name],
		JSON_VALUE(AR.Content, '$.NameOnPrint') NameOnPrint,
		JSON_VALUE(AR.Content, '$.PrimaryContactName') PrimaryContactName,
		JSON_VALUE(AR.Content, '$.PrimaryContactEmail') PrimaryContactEmail,
		JSON_VALUE(AR.Content, '$.PrimaryContactPhone') PrimaryContactPhone,
		JSON_VALUE(AR.Content, '$.SecondaryContactName') SecondaryContactName,
		JSON_VALUE(AR.Content, '$.SecondaryContactEmail') SecondaryContactEmail,	
		JSON_VALUE(AR.Content, '$.SecondaryContactPhone') SecondaryContactPhone,
		JSON_VALUE(AR.Content, '$.PanNumber') PanNumber,	
		JSON_VALUE(AR.Content, '$.TinNumber') TinNumber,
		JSON_VALUE(AR.Content, '$.TanNumber') TanNumber,
		JSON_VALUE(AR.Content, '$.CinNumber') CinNumber,	
		JSON_VALUE(AR.Content, '$.BilledToAddress') BilledToAddress,
		JSON_VALUE(AR.Content, '$.BilledToPincode') BilledToPincode,
		JSON_VALUE(AR.Content, '$.BilledToGstNumber') BilledToGstNumber,	
		JSON_VALUE(AR.Content, '$.ShippedToAddress') ShippedToAddress,
		JSON_VALUE(AR.Content, '$.ShippedToPincode') ShippedToPincode,
		JSON_VALUE(AR.Content, '$.ShippedToGstNumber') ShippedToGstNumber,	
		JSON_VALUE(AR.Content, '$.MsmeRegistrationNumber') MsmeRegistrationNumber,
		JSON_VALUE(AR.Content, '$.IsMsme') IsMsme,
		CG.[Name] AS CustomerGroup,	
		CI.[Name] AS CustomerIndustry,
		TenantOffice.OfficeName AS [Location],
		BC.[Name] AS BilledToCity,
		BCOUNTRY.[Name] AS BilledToCountry,
		BSTATE.[Name] AS BilledToState,
		SC.[Name] AS ShippedToCity,
		SCOUNTRY.[Name] AS ShippedToCountry,
		SSTATE.[Name] AS ShippedToState,
		GTYPE.[Name] AS GstType,
        RS.Code AS ReviewStatus,
		RS.[Name] AS ReviewStatusName,
        CU.FullName AS CreatedUserName, 
        AR.CreatedOn
		FROM ApprovalRequest AR 
	    LEFT JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	    LEFT JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
	    LEFT JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
		LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
		LEFT JOIN MasterEntityData RS ON RS.Id = AR.ReviewStatusId
		LEFT JOIN MasterEntityData CG ON CG.Id= JSON_VALUE(AR.Content, '$.CustomerGroupId')
		LEFT JOIN MasterEntityData CI ON CI.Id= JSON_VALUE(AR.Content, '$.CustomerIndustryId')
		LEFT JOIN TenantOffice ON TenantOffice.Id = JSON_VALUE(AR.Content, '$.TenantOfficeId')
		LEFT JOIN City BC ON BC.Id= JSON_VALUE(AR.Content, '$.BilledToCityId')
		LEFT JOIN Country BCOUNTRY ON BCOUNTRY.Id= JSON_VALUE(AR.Content, '$.BilledToCountryId')
		LEFT JOIN [State] BSTATE ON BSTATE.Id= JSON_VALUE(AR.Content, '$.BilledToStateId')
		LEFT JOIN City SC ON SC.Id= JSON_VALUE(AR.Content, '$.ShippedToCityId')
		LEFT JOIN Country SCOUNTRY ON SCOUNTRY.Id= JSON_VALUE(AR.Content, '$.ShippedToCountryId')
		LEFT JOIN [State] SSTATE ON SSTATE.Id= JSON_VALUE(AR.Content, '$.ShippedToStateId')
		LEFT JOIN MasterEntityData GTYPE ON GTYPE.Id = JSON_VALUE(AR.Content, '$.GstTypeId')
    WHERE 
        AR.Id = @ApprovalRequestId;
END