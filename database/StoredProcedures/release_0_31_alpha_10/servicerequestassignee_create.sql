CREATE OR ALTER PROCEDURE [dbo].[servicerequestassignee_create]
    @CreatedBy INT,
	@AssignmentDetails NVARCHAR(MAX),
    @IsEngineerAssigned INT OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @CaseStatusId INT;
	SELECT @CaseStatusId = Id From MasterEntityData WHERE Code = 'SRS_SFDG'
	DECLARE @ServiceRequestDetails TABLE (Id INT,ServiceRequestId INT);

    BEGIN TRANSACTION;
    SET XACT_ABORT ON;

    -- Update the existing record's EndsOn field if it exists
	UPDATE ServiceRequestAssignee
	SET EndsOn = CASE WHEN EndsOn IS NULL THEN GETUTCDATE() ELSE EndsOn END
	FROM ServiceRequestAssignee SRA
	INNER JOIN OPENJSON(@AssignmentDetails) WITH (ServiceRequestId INT '$.ServiceRequestId') AS SR
	ON SRA.ServiceRequestId = SR.ServiceRequestId;

    -- Insert a new record
	INSERT INTO ServiceRequestAssignee (
		ServiceRequestId,
		AssigneeId,
		Remarks,
		StartsFrom,
		CreatedBy,
		CreatedOn
	)
	OUTPUT INSERTED.Id, INSERTED.ServiceRequestId INTO @ServiceRequestDetails
	SELECT 
		ServiceRequestId,
		AssigneeId,
		Remarks,
		StartsFrom,
		@CreatedBy AS CreatedBy,
		GETUTCDATE() AS CurrentUtcDate
	FROM OPENJSON(@AssignmentDetails)
	WITH
	(
		ServiceRequestId INT '$.ServiceRequestId',
		AssigneeId INT '$.AssigneeId',
		Remarks NVARCHAR(128) '$.Remarks',
		StartsFrom DATETIME '$.StartsFrom'
	);

	UPDATE ServiceRequest
	SET
		CaseStatusId = @CaseStatusId,
		ServiceRequestAssignmentId = SRD.Id
	FROM @ServiceRequestDetails SRD
	WHERE ServiceRequest.Id = SRD.ServiceRequestId;
    SET @IsEngineerAssigned = 1;
    COMMIT TRANSACTION;
END