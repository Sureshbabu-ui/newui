CREATE OR ALTER   PROCEDURE [dbo].[contractassetdetail_for_part_indent_request]
	@ServiceRequestId INT
AS
BEGIN 
	SELECT
		A.ProductSerialNumber,
		M.[Name] AS Make,
		APC.CategoryName,
		P.ModelName,
		CAD.AmcValue,
		APC.Id AS AssetProductCategoryId,
		C.Id AS ContractId,
		CAST(
			CASE 
				WHEN A.WarrantyEndDate > GETDATE() THEN 1 
				ELSE 0 
			END AS BIT
		) AS IsWarranty
	FROM  ServiceRequest SR
		LEFT JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
		INNER JOIN Asset A ON A.Id = CAD.AssetId 
		LEFT JOIN Make M ON M.Id = A.ProductMakeId
		LEFT JOIN AssetProductCategory APC ON APC.Id = A.AssetProductCategoryId
		LEFT JOIN Product P ON P.Id = A.ProductModelId
		LEFT JOIN Contract C ON C.Id = SR.ContractId
WHERE 
		SR.Id = @ServiceRequestId	
END
