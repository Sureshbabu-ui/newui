CREATE OR ALTER   PROCEDURE [dbo].[vendorinfo_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @SearchWith VARCHAR(64) = NULL,
	@Filters VARCHAR(1024) = NULL
AS 
BEGIN
SET NOCOUNT ON;
	DECLARE @SearchText varchar(64)
	SET @SearchText	= JSON_VALUE(@Filters, '$.SearchText')

    IF @Page < 1
        SET @Page = 1;
    BEGIN
        SELECT 
            VendorInfo.Id,
			Vendor.VendorCode,
			VendorInfo.VendorId,
            VendorInfo.[Name],
			VendorType.Name AS VendorType,
            City.[Name] AS City,
            VendorInfo.IsActive,
            VendorInfo.ContactName,
            VendorInfo.ContactNumberOneCountryCode,
            VendorInfo.ContactNumberOne,
            VendorInfo.IsActive,
			TenantOffice.OfficeName AS TenantLocation
        FROM 
            VendorInfo
			LEFT JOIN Vendor ON VendorInfo.VendorId = Vendor.Id
			LEFT JOIN TenantOffice ON VendorInfo.TenantOfficeId = TenantOffice.Id
			LEFT JOIN City ON VendorInfo.CityId = City.Id
			LEFT JOIN MasterEntityData VendorType ON VendorInfo.VendorTypeId= VendorType.Id
        WHERE 
			VendorInfo.EffectiveTo IS NULL AND
			VendorInfo.IsActive = 1 AND
			(@Filters IS NULL AND @SearchWith IS NULL OR 
			((@SearchWith='Name' AND VendorInfo.Name LIKE '%' + @SearchText + '%') OR
            (@SearchWith='Code' AND Vendor.VendorCode LIKE '%' + @SearchText + '%') OR
            (@SearchWith='Location' AND TenantOffice.OfficeName LIKE '%' + @SearchText + '%') OR 
			(@SearchWith='VendorType' AND VendorType.Name  LIKE '%' + @SearchText + '%'))
			)
        ORDER BY VendorInfo.Id DESC 
        OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
    END
END
