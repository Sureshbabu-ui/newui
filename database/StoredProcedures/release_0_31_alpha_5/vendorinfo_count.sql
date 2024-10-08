CREATE OR ALTER PROCEDURE [dbo].[vendorinfo_count]
    @SearchWith        VARCHAR(50) = NULL,
    @TotalRows     INT OUTPUT,	
	@Filters VARCHAR(1024) = NULL
AS 
BEGIN
	DECLARE @SearchText varchar(64)

	SET @SearchText	= JSON_VALUE(@Filters, '$.SearchText')

    IF (@Filters IS NOT NULL)
    BEGIN
        SELECT 
            @TotalRows = COUNT(VendorInfo.Id) 
        FROM 
            VendorInfo
			LEFT JOIN Vendor ON VendorInfo.VendorId = Vendor.Id
			LEFT JOIN TenantOffice ON VendorInfo.TenantOfficeId = TenantOffice.Id
        WHERE
			VendorInfo.EffectiveTo IS NULL AND
			VendorInfo.IsActive = 1 AND
			((@SearchWith='Name' AND VendorInfo.Name LIKE '%' + @SearchText + '%') OR
            (@SearchWith='Code' AND Vendor.VendorCode LIKE '%' + @SearchText + '%') OR
            (@SearchWith='Location' AND TenantOffice.OfficeName LIKE '%' + @SearchText + '%'))
	END
    ELSE
    BEGIN
    BEGIN
        SELECT 
            @TotalRows = COUNT(VendorInfo.Id) 
        FROM 
            VendorInfo
		WHERE
			EffectiveTo IS NULL AND
			IsActive = 1
    END
    END
END