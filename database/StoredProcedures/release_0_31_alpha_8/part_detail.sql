CREATE OR ALTER PROCEDURE [dbo].[part_detail]
	@PartId INT
AS
BEGIN
	SELECT
		P.Id,
		P.PartName,
		P.PartCode,
		P.HsnCode,
		P.OemPartNumber,
		P.Quantity AS PartQuantity,
		PC.[Name] AS PartCategoryName,
		PPC.CategoryName AS ProductCategoryName,
        M.[Name] AS MakeName,
		P.GstRate
	FROM
        Part P
		LEFT JOIN PartCategory PC ON PC.Id = P.PartCategoryId
        LEFT JOIN Make M ON M.Id = P.MakeId
        LEFT JOIN PartProductCategory PPC ON PPC.Id=P.PartProductCategoryId
	WHERE P.Id = @PartId
END