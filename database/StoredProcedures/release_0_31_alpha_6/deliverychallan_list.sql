CREATE OR ALTER PROCEDURE [dbo].[deliverychallan_list]
	@Page INT = 1,
	@PerPage INT = 10,
	@Search varchar(50) = NULL
AS
BEGIN 
	SET NOCOUNT ON;

	IF @Page < 1
	SET @Page = 1;
    SELECT 
        DC.Id,
		DC.DcNumber,
		DC.DcDate,
		MED.[Name] AS DcType,
		MED.Code AS DcTypeCode,
		DC.SourceTenantOfficeId,
		ST.OfficeName AS SourceTenantOffice,
		IE.FullName AS IssuedEmployee,
		DV.[Name] AS DestinationVendor,
		DT.OfficeName AS DestinationTenantOffice,
		DE.FullName AS DestinationEmployee
	FROM
        DeliveryChallan DC
		LEFT JOIN MasterEntityData MED ON MED.Id = DC.DcTypeId
		LEFT JOIN TenantOffice ST ON ST.Id = DC.SourceTenantOfficeId
		LEFT JOIN UserInfo IE ON IE.Id = DC.IssuedEmployeeId
		LEFT JOIN TenantOffice DT ON DT.Id = DC.DestinationTenantOfficeId
		LEFT JOIN UserInfo DE ON DE.Id = DC.DestinationEmployeeId
		LEFT JOIN VendorInfo DV ON DV.Id = DC.DestinationVendorId
	WHERE
		(ISNULL(@Search, '') = '' OR DC.DcNumber LIKE '%' + @Search + '%')
    ORDER BY DC.DcDate DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END