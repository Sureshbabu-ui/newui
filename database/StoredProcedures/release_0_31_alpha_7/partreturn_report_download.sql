CREATE OR ALTER PROCEDURE [dbo].[partreturn_report_download]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @ReturnedPartTypeId INT = NULL,
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
    @ServiceEngineerId INT = NULL,
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
		 (CASE WHEN PS.Id IS NOT NULL THEN PS.SerialNumber ELSE PR.SerialNumber END) AS SerialNumber,
		 (CASE WHEN PS.Id IS NOT NULL THEN PS.Barcode ELSE PR.Barcode END) AS Barcode,		
		 CONVERT(VARCHAR(10), PR.ReturnInitiatedOn, 120) AS ReturnInitiatedOn,
		 RI.FullName AS ServiceEngineer,
		 CONVERT(VARCHAR(10), PR.ReceivedOn, 120) AS ReceivedOn,
		 RB.FullName AS ReceivedBy,
		 RPT.[Name] AS ReturnedPartType,
		 Part.PartCode,
		 Part.PartName,
		 Part.HsnCode,
		 Part.OemPartNumber,
		 Part.[Description],
		 PS.Rate,
		 ST.[Name] AS StockType,
		 CONVERT(VARCHAR(10), PS.PartWarrantyExpiryDate, 120) AS PartWarrantyExpiryDate,
		 T.OfficeName AS ReceivingLocation,
		 GRN.GrnNumber,
		 CONVERT(VARCHAR(10),  GRN.GrnDate, 120) AS GrnDate,
		 GTT.TransactionType
    FROM PartReturn PR
		LEFT JOIN Part ON Part.Id = PR.PartId
		LEFT JOIN PartStock PS 
			ON (PR.PartStockId IS NOT NULL AND PS.Id = PR.PartStockId)
			OR (PR.PartStockId IS NULL AND (PR.SerialNumber = PS.SerialNumber OR PR.Barcode = PS.Barcode)) 
		LEFT JOIN MasterEntityData ST ON ST.Id = PS.StockTypeId
		LEFT JOIN MasterEntityData RPT ON RPT.Id = PR.ReturnedPartTypeId
		LEFT JOIN GoodsReceivedNoteDetail GRND ON GRND.Id = PS.GrnDetailId
		LEFT JOIN GoodsReceivedNote GRN ON GRN.Id = GRND.GoodsReceivedNoteId
		LEFT JOIN GrnTransactionType GTT ON GTT.Id = GRN.TransactionTypeId
		LEFT JOIN TenantOffice T ON T.Id = PR.ReceivingLocationId
		LEFT JOIN UserInfo RI ON RI.Id =  PR.ReturnInitiatedBy
		LEFT JOIN UserInfo RB ON RB.Id =  PR.ReceivedBy
	WHERE (CAST(PR.ReturnInitiatedOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
		  AND (@IsUnderWarranty IS NULL OR @IsUnderWarranty = 1 AND PartWarrantyExpiryDate >= CONVERT(date, GETDATE()) OR @IsUnderWarranty = 0 AND PartWarrantyExpiryDate < CONVERT(date, GETDATE())) 
		  AND (@ReturnedPartTypeId IS NULL OR PR.ReturnedPartTypeId = @ReturnedPartTypeId)
          AND (@ServiceEngineerId IS NULL OR PR.ReturnInitiatedBy = @ServiceEngineerId)
          AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR PR.ReceivingLocationId = @TenantOfficeId) AND
		  (
			@UserCategory = 'UCT_FRHO'
			OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
			OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		  )
	ORDER BY PR.ReturnInitiatedOn DESC
END