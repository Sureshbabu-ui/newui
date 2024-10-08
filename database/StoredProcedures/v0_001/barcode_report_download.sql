CREATE OR ALTER PROCEDURE [dbo].[barcode_report_download]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@IsUnderWarranty BIT = NULL,
	@UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;

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
		 T.OfficeName AS TenantOffice,
		 PS.Barcode,
		 PID.DemandNumber,
		 PID.WorkOrderNumber,
		 PID.WarrantyPeriod,
		 CONVERT(VARCHAR(10), PS.PartWarrantyExpiryDate, 120) AS PartWarrantyExpiryDate,
		 PO.PoNumber,
		 CONVERT(VARCHAR(10),  PO.PoDate, 120) AS PoDate,
		 Part.PartCode,
		 ST.[Name] AS PartType,
		 Part.[Description],
		 VI.[Name] AS Vendor,
		 PS.Rate AS PartValue,
		 GRN.GrnNumber,
		 CONVERT(VARCHAR(10),  GRN.GrnDate, 120) AS GrnDate,
		 GRN.ReferenceNumber,
		 CONVERT(VARCHAR(10),  GRN.ReferenceDate, 120) AS ReferenceDate
    FROM PartStock PS
		LEFT JOIN Part ON Part.Id = PS.PartId
		LEFT JOIN MasterEntityData ST ON ST.Id = PS.StockTypeId
		INNER JOIN GoodsReceivedNoteDetail GRND ON GRND.Id = PS.GrnDetailId
		INNER JOIN GoodsReceivedNote GRN ON GRN.Id = GRND.GoodsReceivedNoteId
		LEFT JOIN GrnTransactionType GTT ON GTT.Id = GRN.TransactionTypeId
		LEFT JOIN TenantOffice T ON T.Id =  PS.TenantOfficeId
		INNER JOIN PurchaseOrder PO ON PO.Id = GRN.TransactionId
		INNER JOIN VendorInfo VI ON VI.VendorId = PO.VendorId
		LEFT JOIN ( SELECT DISTINCT PartIndentRequestId,PurchaseOrderId FROM PurchaseOrderDetail ) POD ON POD.PurchaseOrderId = PO.Id
		INNER JOIN PartIndentRequest PIR ON PIR.Id = POD.PartIndentRequestId
		INNER JOIN PartIndentDemand PID ON PID.PartIndentRequestNumber = PIR.IndentRequestNumber AND PID.PartId = PS.PartId
	WHERE GTT.TransactionTypeCode = 'GTT_PORD' 
		  AND (CAST(PIR.CreatedOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
		  AND (@IsUnderWarranty IS NULL OR @IsUnderWarranty = 1 AND PS.PartWarrantyExpiryDate >= CONVERT(date, GETDATE()) OR @IsUnderWarranty = 0 AND PS.PartWarrantyExpiryDate < CONVERT(date, GETDATE())) 
          AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR PS.TenantOfficeId = @TenantOfficeId) 
		  AND (
				@UserCategory = 'UCT_FRHO'
				OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
				OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		      )
	ORDER BY PS.CreatedOn DESC
END