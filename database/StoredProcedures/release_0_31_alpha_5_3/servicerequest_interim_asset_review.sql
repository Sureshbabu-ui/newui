CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_interim_asset_review]
	@ServiceRequestId	INT,
	@ContractAssetId INT,
	@InterimReviewRemarks VARCHAR(128) = NULL,
	@ReviewedBy INT,
	@IsFinanceApprovalNeeded BIT OUTPUT
AS
BEGIN
SET NOCOUNT ON;
	DECLARE @IsReviewRemarks VARCHAR(2048);
	DECLARE @InterimAssetStatusId INT;
	DECLARE @CustomerSiteTenantOfficeId INT;
	DECLARE @CustomerSiteId INT;

	-- Select the remarks if already reviewed
	SELECT @IsReviewRemarks = InterimReviewRemarks FROM ServiceRequest WHERE Id = @ServiceRequestId

	--finance approval needed check
	SELECT @IsFinanceApprovalNeeded = CASE
									  WHEN Contract.CallStopDate < CONVERT(DATE, GETUTCDATE()) AND ServiceRequest.InterimCaseFinanceAprovedBy IS NULL THEN 1
									  ELSE 0
								  END
	FROM Contract
	INNER JOIN ServiceRequest ON Contract.Id = ServiceRequest.ContractId
	WHERE ServiceRequest.Id = @ServiceRequestId;

    SET XACT_ABORT ON;
    BEGIN TRANSACTION;
	SELECT @InterimAssetStatusId = Id FROM MasterEntityData WHERE Code = 'IAS_APRV'

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
		InterimCaseAssetApprovedOn = GETUTCDATE(),
		ContractAssetId = @ContractAssetId
	WHERE Id = @ServiceRequestId;

	-- Update ContractInterimAsset
	UPDATE CIA
	SET 
		CIA.InterimAssetStatusId = @InterimAssetStatusId,
		CIA.ReviewRemarks = @InterimReviewRemarks,
		CIA.ReviewedBy = @ReviewedBy,
		CIA.ReviewedOn = GETUTCDATE()
	FROM ContractInterimAsset AS CIA
		INNER JOIN ServiceRequest AS SR ON CIA.Id = SR.ContractInterimAssetId
	WHERE 
		SR.Id = @ServiceRequestId;

	COMMIT TRANSACTION
END