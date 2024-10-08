CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednote_list]
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL
AS
BEGIN 
	SET NOCOUNT ON;

	IF @Page < 1
	SET @Page = 1;
    SELECT 
		GRN.Id,
        GRN.GrnNumber,
		GRN.GrnDate,
		GRNTransactionType.TransactionType,
		GrnTransactionType.TransactionTypeCode,
		GRN.ReferenceNumber,
		GRN.ReferenceDate,
		GRN.IsProcessed,
		ReceivedBy.FullName AS ReceivedBy,
		ReceivedLocation.OfficeName AS ReceivedLocation,
		T.OfficeName AS SourceLocation,
		Engineer.FullName AS SourceEngineer,
		VI.[Name] AS SourceVendor,
		PO.PoNumber
	FROM 
        GoodsReceivedNote GRN
		LEFT JOIN UserInfo ReceivedBy ON ReceivedBy.Id = GRN.ReceivedById
		LEFT JOIN TenantOffice T ON GRN.SourceLocationId = T.Id
		LEFT JOIN UserInfo Engineer ON Engineer.Id = GRN.SourceEngineerId
		LEFT JOIN Vendor ON Vendor.Id = GRN.SourceVendorId
		LEFT JOIN VendorInfo VI ON VI.VendorId = Vendor.Id
		LEFT JOIN GrnTransactionType ON GRNTransactionType.Id = GRN.TransactionTypeId
		LEFT JOIN PurchaseOrder PO ON PO.Id = GRN.TransactionId
		LEFT JOIN TenantOffice ReceivedLocation ON ReceivedLocation.Id = GRN.ReceivedLocationId
	WHERE
        (ISNULL(@Search, '') = '' OR GRN.GrnNumber LIKE '%' + @Search + '%')
    ORDER BY GRN.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END