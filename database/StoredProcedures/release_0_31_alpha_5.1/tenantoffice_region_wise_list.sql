CREATE OR ALTER PROCEDURE [dbo].[tenantoffice_region_wise_list]
	@RegionId INT
 AS
 BEGIN
	 SET NOCOUNT ON;
	 SELECT
		T.Id,
		T.OfficeName,
		TOI.[Address] 
	 FROM TenantOffice T
		 LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId= T.Id 
	 WHERE T.RegionId=@RegionId
 END