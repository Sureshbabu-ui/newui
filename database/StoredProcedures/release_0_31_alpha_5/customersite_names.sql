CREATE OR ALTER PROCEDURE [dbo].[customersite_names]
	@CustomerInfoId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CS.Id,
		CS.SiteName,
		CS.[Address] 
	FROM  CustomerSite CS
	LEFT JOIN Customer C ON C.Id = CS.CustomerId
	LEFT JOIN  CustomerInfo CI ON CI.CustomerId = C.Id
	WHERE 
		CS.IsActive = 1 AND 
		CI.Id = @CustomerInfoId
END