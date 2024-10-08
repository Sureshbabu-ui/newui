USE [BeSure]
GO
/****** Object:  StoredProcedure [dbo].[servicerequest_callcordinator_calldetails]    Script Date: 12-09-2024 12:54:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER   PROCEDURE [dbo].[servicerequest_callcordinator_calldetails]
    @ServiceRequestId INT
AS
BEGIN
SET NOCOUNT ON;
	BEGIN
		SELECT 
			SR.Id,
			SR.WorkOrderNumber,
			SR.WorkOrderCreatedOn,
			SR.CaseReportedOn,
			SR.CaseReportedCustomerEmployeeName,
			SR.CaseId,
			SR.IncidentId,
			SR.CustomerReportedIssue,
			SR.CallcenterRemarks,
			SR.OptedForRemoteSupport,
			CallType.[Name] AS CallType,
			CustomerContactType.[Name] AS CustomerContactType,
			CallStatus.[Name]  AS CallStatus,
			RSNOR.[Name] AS RemoteSupportNotOptedReason,
			CreatedBy.FullName AS CreatedBy,
			SR.EndUserName,
			COALESCE(NULLIF(SR.EndUserPhone,''),CS.PrimaryContactPhone) AS EndUserPhone,
			COALESCE(NULLIF(SR.EndUserEmail,''),CS.PrimaryContactEmail) AS EndUserEmail,
			CustomerInfo.[Name] AS CustomerName,
			Customer.CustomerCode,
			CS.SiteName AS CustomerSiteName,
			CS.[Address] AS SiteAddress,
			SR.CustomerServiceAddress,
			CallStatus.Code AS CallStatusCode,
			C.ContractNumber,
			SR.TicketNumber
		FROM
			ServiceRequest AS SR
			LEFT JOIN Contract C ON C.Id = SR.ContractId
			LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = SR.Id
			LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId
			LEFT JOIN MasterEntityData CustomerContactType ON CustomerContactType.Id = CustomerContactTypeId 
			LEFT JOIN MasterEntityData CallType ON SR.CallTypeId = CallType.Id
			LEFT JOIN MasterEntityData RSNOR ON SR.RemoteSupportNotOptedReason = RSNOR.Id
			LEFT JOIN Customer ON Customer.Id = CustomerInfo.CustomerId
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN CustomerSite AS CS ON CS.Id = A.CustomerSiteId
			LEFT JOIN UserInfo AS CreatedBy ON CreatedBy.Id = SR.CreatedBy
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
		    SR.Id = @ServiceRequestId
	END
END
