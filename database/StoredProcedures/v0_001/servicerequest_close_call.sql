CREATE OR ALTER procedure [dbo].[servicerequest_close_call] 
	@ServiceRequestId INT,
	@ClosureRemarks VARCHAR(2048) = NULL,
	@SlaBreachedReason VARCHAR(2048) = NULL,
	@IsSlaBreached BIT,
	@CaseStatusCode VARCHAR(8),
	@HoursSpent DECIMAL(6,2) = NULL,
	@InterimReviewRemarks VARCHAR(128) = NULL,
	@InterimAssetStatus VARCHAR(8) = NULL,
	@ClosedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;
	DECLARE @InterimAssetStatusId INT;
	DECLARE @CaseStatusId INT;
	SELECT @CaseStatusId = Id FROM MasterEntityData WHERE Code = @CaseStatusCode
	SELECT @InterimAssetStatusId = Id FROM MasterEntityData WHERE Code = @InterimAssetStatus
UPDATE	ServiceRequest
	SET
		HoursSpent   = @HoursSpent,
        CaseStatusId = @CaseStatusId,
		ClosureRemarks = @ClosureRemarks,
		SlaBreachedReason = @SlaBreachedReason,
		IsSlaBreached = @IsSlaBreached,
		InterimReviewRemarks = @InterimReviewRemarks,
		ClosedBy= @ClosedBy,
		ClosedOn = GETUTCDATE()
    WHERE
		Id = @ServiceRequestId;

-- Update ContractInterimAsset
	IF @InterimAssetStatus IS NOT NULL
	BEGIN
		UPDATE CIA
		SET CIA.InterimAssetStatusId = @InterimAssetStatusId,
			CIA.ReviewRemarks = @InterimReviewRemarks,
			CIA.ReviewedBy = @ClosedBy,
			CIA.ReviewedOn =  GETUTCDATE()
		FROM ContractInterimAsset AS CIA
			INNER JOIN ServiceRequest AS SR ON CIA.Id = SR.ContractInterimAssetId
		WHERE 
		SR.Id = @ServiceRequestId;
	END
	COMMIT TRANSACTION
END