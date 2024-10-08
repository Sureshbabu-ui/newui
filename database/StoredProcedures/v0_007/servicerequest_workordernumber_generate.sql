CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_workordernumber_generate]
    @ServiceRequestId INT,
    @IsWorkOrderNumberGenerated INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;
	DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @TenantOfficeId INT;

    -- Update LocationSetting
	SELECT TOP 1 @TenantOfficeId = CustomerSite.TenantOfficeId
		FROM CustomerSite
		INNER JOIN Asset ON Asset.CustomerSiteId = CustomerSite.Id
		INNER JOIN ContractAssetDetail ON ContractAssetDetail.AssetId = Asset.Id AND ContractAssetDetail.IsActive = 1
		INNER JOIN ServiceRequest ON ServiceRequest.Id = @ServiceRequestId
		INNER JOIN Contract ON Contract.Id = ServiceRequest.ContractId
		INNER JOIN MasterEntityData AS ContractStatus ON ContractStatus.Id = Contract.ContractStatusId
		INNER JOIN MasterEntityData AS CallStatus ON ServiceRequest.CaseStatusId = CallStatus.Id
		WHERE ContractAssetDetail.Id = ServiceRequest.ContractAssetId
			/*TODO: Need to change the id based conditions*/
			AND ContractStatus.Code = 'CTS_APRV'
			AND CallStatus.Code NOT IN ('SRS_DRFT', 'SRS_CLSD', 'SRS_RCLD')
			AND Contract.CallExpiryDate>= @CurrentDate 
			AND ServiceRequest.Id = @ServiceRequestId


	DECLARE @Year INT = YEAR(@CurrentDate)
	DECLARE @Month INT = MONTH(@CurrentDate)
	DECLARE @FyStartMonth INT;
	DECLARE @IndentRequestNumber VARCHAR(20);

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
	SET @Year=@Year%100;
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	EXEC [dbo].[documentnumberformat_get_nextnumber]
		@DocumentTypeCode = 'DCT_WON',
		@Year = @Year,
		@TenantOfficeId = @TenantOfficeId,
		@DocumentNumber = @IndentRequestNumber OUTPUT;

    -- Update ServiceRequest
    UPDATE ServiceRequest
	SET
		WorkOrderCreatedOn = GETUTCDATE(),
		WorkOrderNumber = @IndentRequestNumber
	FROM ServiceRequest
	INNER JOIN ContractAssetDetail ON ServiceRequest.ContractAssetId = ContractAssetDetail.Id
	INNER JOIN Contract ON Contract.Id = ServiceRequest.ContractId
	INNER JOIN MasterEntityData AS ContractStatus ON ContractStatus.Id = Contract.ContractStatusId
	LEFT JOIN MasterEntityData AS CallStatus ON ServiceRequest.CaseStatusId = CallStatus.Id
	WHERE ServiceRequest.Id = @ServiceRequestId
		AND ContractAssetDetail.Id = ServiceRequest.ContractAssetId
		/*TODO: Need to change the id based conditions*/
		AND ContractStatus.Code = 'CTS_APRV'
		AND CallStatus.Code NOT IN ('SRS_DRFT', 'SRS_CLSD', 'SRS_RCLD')
	    AND Contract.CallExpiryDate>= @CurrentDate 
    COMMIT TRANSACTION;
    SET @IsWorkOrderNumberGenerated = 1;
END;
