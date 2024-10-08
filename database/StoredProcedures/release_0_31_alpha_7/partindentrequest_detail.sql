CREATE OR ALTER PROCEDURE [dbo].[partindentrequest_detail]
	@PartIndentRequestId INT
AS
BEGIN
	SELECT
		PIRD.Id,
		PIRD.PartId,
		PIRD.Quantity,
		PIRD.Remarks,
		PIRD.IsWarrantyReplacement,
        P.PartCode,
        P.[Description] PartName,
	    P.HsnCode,
        P.OemPartNumber,
        PC.[Name] AS PartCategoryName,
		PartProductCategory.CategoryName AS ProductCategoryName,
        M.[Name] AS MakeName,
		PartRequestStatus.[Name] AS PartRequestStatus,
		PartRequestStatus.Code AS PartRequestStatusCode,
		StockType.[Name] AS StockType,
		GIRN.AllocatedOn,
		GIRN.GinNumber,
		GIRN.Id AS GIRNId,
		GIRN.ReceivedOn
	FROM 
        PartIndentRequestDetail PIRD
		INNER JOIN Part P ON P.Id=PIRD.PartId
		INNER JOIN PartCategory PC ON PC.Id = P.PartCategoryId
        INNER JOIN Make M ON M.Id = P.MakeId
        INNER JOIN PartProductCategory ON PartProductCategory.Id=P.PartProductCategoryId
		INNER JOIN MasterEntityData PartRequestStatus ON PartRequestStatus.Id = PIRD.RequestStatusId
	    LEFT JOIN MasterEntityData StockType ON StockType.Id = PIRD.StockTypeId
		LEFT JOIN PartIndentDemand PID ON PID.PartIndentRequestDetailId = PIRD.Id
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId= PID.Id
	WHERE PIRD.PartIndentRequestId= @PartIndentRequestId	
END