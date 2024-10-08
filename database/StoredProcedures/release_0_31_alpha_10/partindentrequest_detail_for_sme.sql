CREATE OR ALTER PROCEDURE [dbo].[partindentrequest_detail_for_sme]
	@PartIndentRequestId INT
AS
BEGIN
	SELECT
		PIRD.Id,
		PIRD.IsWarrantyReplacement,
        P.PartCode,
        P.[Description] PartName,
        P.HsnCode,
		StockType.Id AS StockTypeId,
		StockType.[Name] AS StockType,
		PIRD.Quantity,
        PC.[Name] AS PartCategoryName,
		PartRequestStatus.[Name] AS PartRequestStatus,
		PartRequestStatus.Code AS PartRequestStatusCode,
		PIRd.ReviewerComments
FROM 
        PartIndentRequestDetail PIRD
		INNER JOIN Part P ON P.Id=PIRD.PartId
		INNER JOIN PartCategory PC ON PC.Id = P.PartCategoryId
		INNER JOIN MasterEntityData PartRequestStatus ON PartRequestStatus.Id = PIRD.RequestStatusId
		INNER JOIN MasterEntityData StockType ON StockType.Id = PIRD.StockTypeId
	WHERE 
		PIRD.PartIndentRequestId = @PartIndentRequestId	
END