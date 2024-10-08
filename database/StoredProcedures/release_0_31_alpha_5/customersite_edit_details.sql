CREATE OR ALTER PROCEDURE [dbo].[customersite_edit_details] 
	@Id INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
			Id,
			CustomerId,
			SiteName,
			[Address],
			CityId,
			StateId,
			Pincode,
			GeoLocation,
			TenantOfficeId,
			PrimaryContactName,
			PrimaryContactPhone,
			PrimaryContactEmail,
			SecondaryContactName,
			SecondaryContactPhone,
			SecondaryContactEmail
	FROM 
			CustomerSite
	WHERE
	   Id = @Id
END 