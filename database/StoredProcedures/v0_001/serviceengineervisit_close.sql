CREATE OR ALTER PROCEDURE [dbo].[serviceengineervisit_close] 
    @ServiceEngineerVisitId INT,
    @EndsOn DATETIME,
    @EngineerNote VARCHAR(1024),
	@IsRemoteSupport BIT,
    @DistanceTravelled  INT,
    @TravelModeId INT,
	@PartIndents NVARCHAR(MAX),
	@ClosedBy INT,
	@ServiceRequestStatusId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	BEGIN TRANSACTION
	DECLARE @ServiceRequestId INT
	DECLARE @ServiceRequestAssigneeId INT

	SELECT @ServiceRequestId = SRA.ServiceRequestId 
	FROM ServiceEngineerVisit AS SEV
		INNER JOIN ServiceRequestAssignee AS SRA ON SRA.Id = SEV.ServiceRequestAssignmentId
	WHERE SEV.Id = @ServiceEngineerVisitId;

	SELECT @ServiceRequestAssigneeId = Id
	FROM (
		SELECT TOP 1 Id
		FROM ServiceRequestAssignee 
		WHERE ServiceRequestId = @ServiceRequestId 
		  AND AssigneeId != @ClosedBy
	) AS AssigneeId;

	DECLARE @StatusCode VARCHAR(1024)
	SELECT @StatusCode=Code FROM MasterEntityData WHERE Id=@ServiceRequestStatusId;

    UPDATE serviceEngineerVisit
    SET
        EndsOn = @EndsOn,
        EngineerNote = @EngineerNote,
        IsRemoteSupport = @IsRemoteSupport ,
		DistanceTravelled = @DistanceTravelled ,
        TravelModeId = @TravelModeId
    WHERE
        Id = @ServiceEngineerVisitId;

	UPDATE ServiceRequest
	SET 
	    CaseStatusId = @ServiceRequestStatusId,
		ResolvedBy = CASE WHEN @statusCode = 'SRS_RSVD' THEN @ClosedBy  ELSE null END,
		ResolvedOn = CASE WHEN @statusCode = 'SRS_RSVD' THEN GETUTCDATE()  ELSE null END,
		ServiceRequestAssignmentId = CASE WHEN @ServiceRequestAssigneeId = 0 THEN NULL ELSE @ServiceRequestAssigneeId END
    WHERE
	    ServiceRequest.Id = @ServiceRequestId;

    UPDATE ServiceRequestAssignee 
    SET 
        EndsOn = GETUTCDATE()
    WHERE
        Id=(SELECT ServiceRequestAssignmentId FROM ServiceEngineerVisit WHERE ServiceEngineerVisit.Id = @ServiceEngineerVisitId)

    INSERT INTO PartInstallation 
	(
		ServiceRequestId,
		ServiceEngineerVisitId,
		PartStockId,
		InstalledOn
	)
	SELECT
		@ServiceRequestId,
		@ServiceEngineerVisitId,
		StockList.VALUE AS PartStockId,
		GETUTCDATE()
	FROM OPENJSON(@PartIndents) AS StockList;

COMMIT TRANSACTION;
END