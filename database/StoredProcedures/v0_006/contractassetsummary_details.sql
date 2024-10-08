CREATE
OR ALTER PROCEDURE [dbo].[contractassetsummary_details] @Id INT AS BEGIN
SET
    NOCOUNT ON;

SELECT
    CAS.Id,
    AssetProductCategory.CategoryName,
    CAS.ContractId,
    CAS.AssetProductCategoryId AS ProductCategoryId,
    CAS.ProductCountAtBooking,
    CAS.AmcValue
FROM
    ContractAssetSummary CAS
    LEFT JOIN AssetProductCategory ON CAS.AssetProductCategoryId = AssetProductCategory.Id
WHERE
    CAS.Id = @Id
END