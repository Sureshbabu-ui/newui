CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @Search VARCHAR(64) = NULL,
    @VendorId INT
AS 
BEGIN
SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;
    IF (@Search IS NOT NULL)
    BEGIN
        SELECT 
            VB.Id,
			VB.Code,
            VB.[Name],
            City.[Name] AS City,
            VB.IsActive,
            VB.ContactName,
            VB.ContactNumberOneCountryCode,
            VB.ContactNumberOne,
            VB.IsActive,
			TOI.OfficeName AS TenantLocation
        FROM 
            VendorBranch AS VB
			LEFT JOIN TenantOffice TOI ON VB.TenantOfficeId = TOI.Id
            LEFT JOIN City ON VB.CityId = City.Id
		WHERE
			VB.IsDeleted = 0 AND
			VB.VendorId = @VendorId AND
			(VB.Name LIKE '%' + @Search + '%')
        ORDER BY VB.Id DESC 
        OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT 
            VB.Id,
			VB.Code,
            VB.[Name],
            City.[Name] AS City,
            VB.IsActive,
            VB.ContactName,
            VB.ContactNumberOneCountryCode,
            VB.ContactNumberOne,
            VB.IsActive,
			TOI.OfficeName AS TenantLocation
        FROM 
            VendorBranch AS VB
			LEFT JOIN TenantOffice TOI ON VB.TenantOfficeId = TOI.Id
            LEFT JOIN City ON VB.CityId = City.Id
		WHERE
			VB.IsDeleted = 0 AND
			VB.VendorId = @VendorId
        ORDER BY VB.Id DESC
        OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
    END
END