CREATE OR ALTER PROCEDURE [dbo].[contractassetsummary_sitewise_list] 
@ContractId INT 
AS 
BEGIN
	 SET NOCOUNT ON;
	 SELECT
			T.OfficeName AS TenantOfficeName,
			CS.SiteName,PC.CategoryName,
			count(CAD.Id) AS AssetCount
			FROM ContractAssetDetail CAD
			LEFT JOIN Asset A ON A.Id = CAD.AssetId
			INNER JOIN CustomerSite CS ON CS.Id=A.CustomerSiteId
			INNER JOIN TenantOffice T ON T.Id=CS.TenantOfficeId
			INNER JOIN  AssetProductCategory PC ON PC.Id=A.AssetProductCategoryId
			WHERE CAD.ContractId=@ContractId AND
			CAD.IsActive = 1
			GROUP BY ROLLUP(T.OfficeName,CS.SiteName,PC.CategoryName)
END