CREATE OR ALTER PROCEDURE [dbo].[part_get_names_by_servicerequest]
	@ServiceRequestId INT
AS
BEGIN

  SET NOCOUNT ON;

  DECLARE @PartProductCategoryId INT;
  SET @PartProductCategoryId =(
                 SELECT AssetProductCategory.PartProductCategoryId FROM  Asset A
				 INNER JOIN ContractAssetDetail CAD ON CAD.AssetId=A.Id
				 INNER JOIN ServiceRequest ON ServiceRequest.ContractAssetId=CAD.Id
				 INNER JOIN AssetProductCategory ON AssetProductCategory.Id=A.AssetProductCategoryId
				 WHERE ServiceRequest.Id=@ServiceRequestId AND CAD.IsActive = 1
  );
	SELECT
		P.Id,
		P.PartName AS [Name],
		P.PartCode AS Code
	FROM
        Part P
        LEFT JOIN PartProductCategory ON PartProductCategory.Id=P.PartProductCategoryId
	WHERE PartProductCategory.Id = @PartProductCategoryId
END
