CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_interim_preamcasset_review]
	@ServiceRequestId	INT,
	@IsPreAmcCompleted	BIT,
	@PreAmcCompletedDate	DATE = NULL,
	@PreAmcCompletedBy	INT = NULL,
	@InterimReviewRemarks VARCHAR(128) = NULL,
	@ReviewedBy INT,
	@IsFinanceApprovalNeeded BIT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
	DECLARE @IsReviewRemarks VARCHAR(2048);
	DECLARE @CustomerSiteTenantOfficeId INT;
	DECLARE @CustomerSiteId INT;

	--finance approval needed check
	SELECT @IsFinanceApprovalNeeded = CASE
									  WHEN ServiceRequest.IsInterimCaseFinanceApprovalNeeded = 1 AND ServiceRequest.InterimCaseFinanceAprovedBy IS NULL THEN 1
									  ELSE 0
								  END
	FROM ServiceRequest
	WHERE Id = @ServiceRequestId;

    SET XACT_ABORT ON;
    BEGIN TRANSACTION;

	--Service request update
	UPDATE ServiceRequest
	SET IsInterimCaseId = CASE WHEN @IsFinanceApprovalNeeded = 1 THEN 1 ELSE 0 END,
		InterimReviewRemarks = CASE
									WHEN @IsReviewRemarks IS NULL THEN
										JSON_QUERY('[{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","Remarks":"' + @InterimReviewRemarks + '","ReviewedOn":"' + CONVERT(VARCHAR, GETUTCDATE(), 126) + '","ReviewedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@ReviewedBy) + '"}]')
									ELSE
										JSON_MODIFY(InterimReviewRemarks, 'append $', JSON_QUERY('{"Id":"' + CONVERT(NVARCHAR(36), NEWID()) + '","Remarks":"' + @InterimReviewRemarks + '","ReviewedOn":"' + CONVERT(VARCHAR, GETUTCDATE(), 126) + '","ReviewedBy":"' + (SELECT FullName FROM UserInfo WHERE UserInfo.Id=@ReviewedBy) + '"}'))
								END,
		InterimCaseAssetApprovedBy = @ReviewedBy,
		InterimCaseAssetApprovedOn = GETUTCDATE()
	WHERE Id = @ServiceRequestId;

	-- Update Asset
	UPDATE CAD
	SET
		IsPreAmcCompleted =  @IsPreAmcCompleted,
		PreAmcCompletedDate = @PreAmcCompletedDate,
		PreAmcCompletedby  = @PreAmcCompletedBy,
		ModifiedBy			= @ReviewedBy,
		ModifiedOn			= GETUTCDATE()
	FROM ServiceRequest AS SR
		INNER JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId
	WHERE 
		SR.Id = @ServiceRequestId;		
	COMMIT TRANSACTION
END