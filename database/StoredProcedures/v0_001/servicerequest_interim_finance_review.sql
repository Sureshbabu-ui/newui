CREATE OR ALTER PROCEDURE [dbo].[servicerequest_interim_finance_review]
	@ServiceRequestId	INT,
	@InterimReviewRemarks VARCHAR(128) = NULL,
	@ReviewedBy INT,
	@IsAssetApprovalNeeded BIT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
	DECLARE @IsReviewRemarks VARCHAR(2048);
	SELECT @IsReviewRemarks = InterimReviewRemarks FROM ServiceRequest WHERE Id = @ServiceRequestId

	--asset approval needed check
	SELECT @IsAssetApprovalNeeded = CASE
									  WHEN ServiceRequest.IsInterimCaseAssetApprovalNeeded = 1 AND ServiceRequest.InterimCaseAssetApprovedBy IS NULL THEN 1
									  ELSE 0
								  END
	FROM ServiceRequest
	WHERE Id = @ServiceRequestId;

	SET XACT_ABORT ON;
    BEGIN TRANSACTION;

    -- service request update	
	UPDATE ServiceRequest
	SET IsInterimCaseId = CASE WHEN @IsAssetApprovalNeeded = 1 THEN 1 ELSE 0 END,
		InterimReviewRemarks = CASE
								   WHEN @IsReviewRemarks IS NULL THEN
									   JSON_QUERY('[{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","Remarks":"' + @InterimReviewRemarks + '","ReviewedOn":"' + CONVERT(VARCHAR, GETUTCDATE(), 126) + '","ReviewedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@ReviewedBy) + '"}]')
								   ELSE
									   JSON_MODIFY(InterimReviewRemarks, 'append $', JSON_QUERY('{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","Remarks":"' + @InterimReviewRemarks + '","ReviewedOn":"' + CONVERT(VARCHAR, GETUTCDATE(), 126) + '","ReviewedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@ReviewedBy) + '"}'))
							   END,
		InterimCaseFinanceAprovedBy = @ReviewedBy,
		InterimCaseFinanceAprovedOn = GETUTCDATE()
	WHERE Id = @ServiceRequestId;

COMMIT TRANSACTION
END