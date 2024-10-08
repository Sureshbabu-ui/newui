CREATE OR ALTER PROCEDURE [dbo].[customer_site_names]
 @CustomerId INT
AS
    BEGIN 
	SET NOCOUNT ON;
	SELECT 
			SiteName,
			Id
		FROM 
			CustomerSite
		WHERE
			CustomerId=@CustomerId AND
			IsDeleted = 0 AND
			IsActive = 1
END 