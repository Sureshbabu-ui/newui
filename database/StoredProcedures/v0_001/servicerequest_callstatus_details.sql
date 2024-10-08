CREATE   OR ALTER  PROCEDURE [dbo].[servicerequest_callstatus_details]
    @ServiceRequestId INT,
	@UserId INT
AS
BEGIN
SET NOCOUNT ON;
	BEGIN
	DECLARE @GeneratedBy VARCHAR(64) = (SELECT FullName FROM UserInfo WHERE UserInfo.Id= @UserId)
		SELECT 
			SR.Id,
			SR.CaseId,
			SR.WorkOrderNumber,
			SR.IncidentId,
			SR.TicketNumber,
			SR.CustomerReportedIssue,
			SR.CallcenterRemarks,
			SR.CustomerServiceAddress,
			SR.EndUserEmail,
			SR.EndUserName,
			SR.EndUserPhone,
		    SR.OptedForRemoteSupport,
			SR.IsInterimCaseId AS IsInterim,
			SR.CreatedOn AS CallCreatedOn,
			SR.ResolvedOn,
			SR.ClosedOn,
			CreatedBy.FullName CallCreatedBy,
			CallSource.[Name] CallSource,
			CallStatus.[Name] CallStatus,
			CallType.[Name]  CallType,
			ServiceMode.[Name] ServiceMode,
			CI.[Name] CustomerName,
			CI.BilledToAddress CustomerAddress, 
			CI.BilledToPincode CustomerPincode,
			CI.PrimaryContactName CustomerContactName,
			CI.PrimaryContactPhone CustomerContactPhone,
			CI.PrimaryContactEmail CustomerContactEmail,
			CustomerCity.[Name] CustomerCityName,
			CustomerState.[Name] CustomerStateName,
			CS.[Address] SiteAddress,
			CS.SiteName,
			CS.Pincode SitePincode,
			CS.PrimaryContactName SiteContactName,
			CS.PrimaryContactPhone SiteContactPhone,
			CS.PrimaryContactEmail SiteContactEmail,
			SiteCity.[Name] SiteCityName,
			SiteState.[Name] SiteStateName,
			A.ProductSerialNumber,
			CAD.IsVipProduct,
			A.WarrantyEndDate,
			CAD.IsPreAmcCompleted,		
			CAD.ResolutionTimeInHours,
			CAD.ResponseTimeInHours,
			CAD.StandByTimeInHours,
			A.MspAssetId AccelAssetID,
			APC.CategoryName,
			APC.GeneralNotCovered,
	        APC.SoftwareNotCovered,
	        APC.HardwareNotCovered,
			M.[Name] AS Make,
			Product.ModelName,		
			SRA.StartsFrom AS AssignedFrom,
			SRA.EndsOn AS AssignedTo,
			AssigneeName.FullName AS AssigneeName,
			AssignedBy.FullName AS AssignedBy,
			AssignedBy.CreatedOn AS AssignedOn,
			TI.NameOnPrint  TenantName,
			TOI.[Address]  TenantAddress,
			TenantCity.[Name] TenantCityName,
			TenantState.[Name] TenantStateName,
			TOI.Pincode TenantPincode,
			[Contract].ContractNumber,
			[Contract].StartDate ContractStartDate,
			[Contract].EndDate ContractEndDate,
			AgType.Name AS AgreementTYpe,
			(STUFF((SELECT DISTINCT ', ' + PC.[Name]
			FROM ContractProductCategoryPartNotCovered CPNC
			INNER JOIN PartCategory PC ON CPNC.PartCategoryId = PC.Id
			INNER JOIN ContractAssetSummary AS CAS2 ON CAS2.Id=CPNC.AssetProductCategoryId
			INNER JOIN ServiceRequest SR2 ON SR2.ContractId= CPNC.ContractId
            WHERE CPNC.ContractId = [Contract].Id
		       AND CPNC.IsDeleted = 0
			   AND SR2.Id = @ServiceRequestId
            for xml path(''), TYPE).value('(./text())[1]', 'NVARCHAR(MAX)'),1,1,'')
		   ) AS PartsNotCovered,
		   (SELECT @GeneratedBy) GeneratedBy
		  FROM 
			ServiceRequest SR
			LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = SR.Id
			LEFT JOIN [Contract] ON [Contract].Id = SR.ContractId
			LEFT JOIN CustomerInfo CI ON CI.Id = SR.CustomerInfoId
			LEFT JOIN Customer ON Customer.Id = CI.CustomerId
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId
			LEFT JOIN Asset A ON A.Id =CAD.AssetId
			LEFT JOIN CustomerSite AS CS ON CS.Id = A.CustomerSiteId
			LEFT JOIN MasterEntityData AS AgType ON [Contract].AgreementTypeId = AgType.Id
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
			LEFT JOIN MasterEntityData AS CallSource ON SR.CallSourceId = CallSource.Id
			LEFT JOIN MasterEntityData  CallType ON SR.CallTypeId = CallType.Id
			LEFT JOIN MasterEntityData AS RSNOR ON SR.RemoteSupportNotOptedReason = RSNOR.Id
			LEFT JOIN MasterEntityData ServiceMode ON [Contract].ServiceModeId = ServiceMode.Id
			LEFT JOIN Product ON Product.Id = A.ProductModelId
			LEFT JOIN AssetProductCategory AS APC ON APC.Id = A.AssetProductCategoryId
			LEFT JOIN Make AS M ON M.Id = A.ProductMakeId
			LEFT JOIN UserInfo AS CreatedBy ON CreatedBy.Id = SR.CreatedBy
			LEFT JOIN UserInfo AS ClosedBy ON ClosedBy.Id = SR.ClosedBy
			LEFT JOIN UserInfo  AssignedBy ON AssignedBy.Id = SRA.CreatedBy AND SRA.EndsOn IS NULL
			LEFT JOIN UserInfo  AssigneeName ON AssigneeName.Id = SRA.AssigneeId AND SRA.EndsOn IS NULL
			LEFT JOIN PartIndentRequest PIR ON PIR.ServiceRequestId = SR.Id
			LEFT JOIN PartIndentRequestDetail PIRD ON PIRD.PartIndentRequestId = PIR.Id
			LEFT JOIN Part ON Part.Id = PIRD.PartId
			LEFT JOIN TenantOffice TOF ON TOF.ID=CS.TenantOfficeId
			LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId =TOF.Id AND TOI.EffectiveTo IS NULL
			LEFT JOIN Tenant ON Tenant.Id= TOF.TenantId
			LEFT JOIN TenantInfo TI ON TI.TenantId =Tenant.Id AND TI.EffectiveTo IS NULL
			LEFT JOIN City AS TenantCity ON TenantCity.Id= TOI.CityId
			LEFT JOIN State AS TenantState ON TenantState.Id= TOI.StateId
			LEFT JOIN City SiteCity ON SiteCity.Id=CS.CityId
			LEFT JOIN State SiteState ON SiteState.Id=CS.StateId
			LEFT JOIN City CustomerCity ON CustomerCity.Id=CI.BilledToCityId
			LEFT JOIN State CustomerState ON CustomerState.Id=CI.BilledToStateId
		WHERE
		    SR.Id = @ServiceRequestId
	END	
END