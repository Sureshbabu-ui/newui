CREATE OR ALTER PROCEDURE [dbo].[demand_report_download]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
	@TimeZone VARCHAR(64),
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;
	DECLARE @DateFormat VARCHAR(16) = 'dd-MM-yyyy';
	DECLARE @DateTimeFormat VARCHAR(16) = 'dd-MM-yyyy HH:mm:ss';
	DECLARE @GRNTransactionId INT;

	SELECT @GRNTransactionId = Id FROM GrnTransactionType WHERE TransactionTypeCode = 'GTT_PORD'

	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = UserInfo.TenantOfficeId,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	IF @DateFrom IS NULL OR @DateTo = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
	SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

	SELECT 
		TR.RegionName,
		PID.Price,
		T.Code AS LocationCode,
		PID.DemandNumber,
		FORMAT(CAST(PID.DemandDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateTimeFormat) AS DemandDate,
		P.MainCodeSol,
		P.[Description],
		StockType.[Name] AS StockType,
		DemandNoteStatus.[Name] AS DemandNoteStatus,
		VI.[Name] AS Vendor,
		PO.PoNumber,
		FORMAT(CAST(PIR.CreatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateTimeFormat) AS IndentDate,
		FORMAT(CAST(PO.PoDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateTimeFormat) AS PoDate,
		SR.WorkOrderNumber,
		Product.ModelName,
		APC.CategoryName AS AssetProductCategory,
		GRN.GrnNumber,
		FORMAT(CAST(GRN.GrnDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,@DateTimeFormat) AS GrnDate,
		AgreementType.[Name] AS DemandType
    FROM PartIndentDemand PID
		LEFT JOIN TenantOffice T ON T.Id =  PID.TenantOfficeId
		LEFT JOIN TenantRegion TR ON TR.Id = T.RegionId
		INNER JOIN MasterEntityData StockType ON StockType.Id = PID.StockTypeId
		INNER JOIN MasterEntityData DemandNoteStatus ON DemandNoteStatus.Id = PID.DemantNoteStatusId
		LEFT JOIN Part P ON P.Id = PID.PartId
		INNER JOIN VendorInfo VI ON VI.VendorId = PID.VendorId
		LEFT JOIN PartIndentRequestDetail PIRD ON PIRD.Id = PID.PartIndentRequestDetailId
		LEFT JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
		LEFT JOIN PurchaseOrderDetail POD ON POD.PartIndentRequestId = PIR.Id AND POD.PartId = PID.PartId
		LEFT JOIN PurchaseOrder PO ON POD.PurchaseOrderId = PO.Id
		INNER JOIN ServiceRequest SR ON SR.Id = PIR.ServiceRequestId
		INNER JOIN [Contract] C ON C.Id = SR.ContractId
		INNER JOIN MasterEntityData AgreementType ON AgreementType.Id = C.AgreementTypeId
		INNER JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId
		INNER JOIN Asset ON Asset.Id = CAD.AssetId
		INNER JOIN Product ON Product.Id = Asset.ProductModelId
		INNER JOIN AssetProductCategory APC ON APC.Id = Asset.AssetProductCategoryId
		LEFT JOIN GoodsReceivedNote GRN ON GRN.TransactionId = PO.Id AND GRN.TransactionTypeId = @GRNTransactionId
	WHERE (CAST(PID.DemandDate AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
          AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR PID.TenantOfficeId = @TenantOfficeId) 
		  AND (
				@UserCategory = 'UCT_FRHO'
				OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
				OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		 )
	ORDER BY PID.CreatedOn DESC
END