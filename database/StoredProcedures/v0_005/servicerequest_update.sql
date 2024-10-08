CREATE OR ALTER PROCEDURE [dbo].[servicerequest_update]
    @IncidentId VARCHAR(16), 
    @CaseStatusId INT,
    @CallSourceId INT,
    @CustomerReportedIssue VARCHAR(2048), 
    @CustomerServiceAddress VARCHAR(128), 
    @CaseReportedCustomerEmployeeName VARCHAR(64),
    @CallTypeId INT,
    @OptedForRemoteSupport INT,
    @RemoteSupportNotOptedReason INT,
    @CustomerContactTypeId INT,
    @EndUserName VARCHAR(64),
    @EndUserPhone VARCHAR(16),
    @EndUserEmail VARCHAR(64),
    @RepairReason VARCHAR(2048),
    @CallCenterRemarks VARCHAR(2048),
	@TicketNumber VARCHAR(16),
	@CallSeverityLevelId INT,
	@UpdatedBy INT,
    @ServiceRequestId INT
AS
BEGIN 
		UPDATE ServiceRequest
		SET 
			IncidentId	= @IncidentId,
			TicketNumber = @TicketNumber,
			CaseStatusId = @CaseStatusId,
			CallTypeId = @CallTypeId,
			CustomerReportedIssue = @CustomerReportedIssue,
			CaseReportedCustomerEmployeeName = @CaseReportedCustomerEmployeeName,
			OptedForRemoteSupport = @OptedForRemoteSupport,
			RemoteSupportNotOptedReason = @RemoteSupportNotOptedReason,
			CustomerContactTypeId = @CustomerContactTypeId,
			EndUserName = @EndUserName,
			EndUserPhone = @EndUserPhone,
			EndUserEmail = @EndUserEmail,
			CallSourceId = @CallSourceId,
			CallSeverityLevelId = @CallSeverityLevelId,
			CustomerServiceAddress = @CustomerServiceAddress,
			CallcenterRemarks = @CallCenterRemarks,
			RepairReason = @RepairReason,
			UpdatedBy = @UpdatedBy,
			UpdatedOn = GETUTCDATE()
		WHERE 
			Id = @ServiceRequestId
END