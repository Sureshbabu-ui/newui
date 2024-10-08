CREATE OR ALTER PROCEDURE [dbo].[draftrequest_create]
    @Content NVARCHAR(MAX),
    @CreatedBy INT,
	@ApprovalEventCode VARCHAR(32),
    @ApprovalWorkflowList NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @TenantOfficeId INT;
    DECLARE @ReviewStatusId INT;
	DECLARE @ApprovalEventId INT = (SELECT Id FROM ApprovalEvent WHERE EventCode = @ApprovalEventCode);
	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_DRFT';    
	SET @TenantOfficeId =(SELECT TenantOfficeId FROM UserInfo WHERE Id =@CreatedBy)

    INSERT INTO ApprovalRequest 
    (
		CaseId, 
		ApprovalEventId,
		EventConditionId,
		Content, 
		CreatedBy,
		CreatedOn, 
		ReviewStatusId,
		TenantOfficeId
	)
    SELECT
    
		1, 
		@ApprovalEventId,
		NULL,
		@Content, 
		@CreatedBy, 
		GETUTCDATE(), 
		@ReviewStatusId,
		ISNULL(TenantOfficeId,@TenantOfficeId)
	FROM OPENJSON(@Content)
    WITH (
		TenantOfficeId INT
	);
END;