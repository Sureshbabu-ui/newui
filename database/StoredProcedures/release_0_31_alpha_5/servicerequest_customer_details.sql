CREATE OR ALTER  PROCEDURE [dbo].[servicerequest_customer_details]
@ServiceRequestId	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
        CI.Id,
        CI.CustomerId,
        Customer.CustomerCode,
        CI.[Name],
	    TenantOffice.OfficeName AS TenantOffice,
        CI.NameOnPrint,
        CG.GroupName,
        CI.TenantOfficeId,
        CI.PrimaryContactName,
        CI.PrimaryContactEmail,
        CI.PrimaryContactPhone,
	    CI.SecondaryContactName,
	    CI.SecondaryContactPhone,
	    CI.SecondaryContactEmail,
        CI.PanNumber,
        CI.TinNumber,
        CI.TanNumber,
        CI.CinNumber,
        CI.BilledToAddress,
        BC.[Name] AS BilledToCityName,
	    SC.[Name] AS ShippedToCityName,
        BCO.[Name] AS BilledToCountryName,
	    SCO.[Name] AS ShippedToCountryName,
        BS.[Name] AS BilledToStateName,
	    SS.[Name] AS ShippedToStateName,
        CI.BilledToPincode,
        CI.BilledToGstNumber,
        CI.ShippedToAddress,
        CI.ShippedToPincode,
        CI.ShippedToGstNumber,
        CI.IsMsme,
        CI.MsmeRegistrationNumber,
        CI.IsContractCustomer,
        CI.EffectiveFrom,
        CI.EffectiveTo,
		Industry.[Name] AS Industry,
        CI.IsDeleted,
        CI.IsVerified,
        CI.CreatedBy,
        CI.CreatedOn,
        CI.ModifiedBy,
        CI.ModifiedOn
    FROM ServiceRequest SR
	INNER JOIN CustomerInfo CI ON CI.Id = SR.CustomerInfoId	
    INNER JOIN Customer ON CI.CustomerId = Customer.Id
    LEFT JOIN City BC ON BC.Id =CI.BilledToCityId
    LEFT JOIN City SC ON SC.Id =CI.ShippedToCityId
    LEFT JOIN [State] BS ON BS.Id =CI.BilledToStateId
    LEFT JOIN [State] SS ON SS.Id =CI.ShippedToStateId
    LEFT JOIN Country BCO ON BCO.Id =CI.BilledToCountryId
    LEFT JOIN Country SCO ON SCO.Id =CI.ShippedToCountryId
    LEFT JOIN CustomerGroup CG ON CG.Id = CI.CustomerGroupId
    LEFT JOIN TenantOffice ON TenantOffice.Id =CI.TenantOfficeId
    LEFT JOIN MasterEntityData Industry ON Industry.Id = CI.CustomerIndustryId
    WHERE
       SR.Id = @ServiceRequestId 
END