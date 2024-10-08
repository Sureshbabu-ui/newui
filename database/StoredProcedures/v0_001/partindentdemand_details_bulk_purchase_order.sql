CREATE OR ALTER PROCEDURE [dbo].[partindentdemand_details_bulk_purchase_order]
    @DemandIdList VARCHAR(128)
AS
BEGIN
    SELECT 
        PID.Id AS DemandId,
        PID.StockTypeId,
        PID.Price,
		P.Id AS PartId,
		P.PartName,
		P.PartCode,
		P.HsnCode,
		P.[Description],
		P.OemPartNumber,
		PID.Quantity,
		PC.[Name] AS PartCategoryName,
		PPC.CategoryName AS ProductCategoryName,
        M.[Name] AS MakeName,
		P.GstRate,
		PIR.Id AS PartIndentRequestId
    FROM 
        PartIndentDemand PID
        LEFT JOIN Part P ON P.Id = PID.PartId
		LEFT JOIN PartCategory PC ON PC.Id = P.PartCategoryId
        LEFT JOIN Make M ON M.Id = P.MakeId
        LEFT JOIN PartProductCategory PPC ON PPC.Id=P.PartProductCategoryId
        LEFT JOIN PartIndentRequest PIR ON PIR.IndentRequestNumber = PID.PartIndentRequestNumber
    WHERE 
        PID.Id IN (SELECT VALUE FROM STRING_SPLIT(@DemandIdList, ','))
END