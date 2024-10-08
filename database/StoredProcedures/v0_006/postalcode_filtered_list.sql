CREATE OR ALTER PROCEDURE [dbo].[postalcode_filtered_list]
	@Pincode VARCHAR(16)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		Id,
		Pincode,
		CountryId,
		StateId,
		CityId
	FROM PostalCode PC
	WHERE PC.IsActive = 1 
		 AND @Pincode IS NULL OR PC.Pincode LIKE @Pincode + '%'
    ORDER BY PC.CreatedOn DESC 
END