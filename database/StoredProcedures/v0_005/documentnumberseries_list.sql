CREATE OR ALTER PROCEDURE [dbo].[documentnumberseries_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @DocumentTypeId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
		DNS.Id,
		DNS.IsActive,
		DNS.DocumentNumber,
		DNS.[Year] AS DNSYear,
		T.OfficeName,
		DocumentType.[Name] AS DocumentType
    FROM DocumentNumberSeries DNS
		LEFT JOIN MasterEntityData DocumentType ON DocumentType.Id = DNS.DocumentTypeId
		LEFT JOIN TenantOffice T ON T.Id = DNS.TenantOfficeId
    WHERE (@DocumentTypeId IS NULL OR DNS.DocumentTypeId = @DocumentTypeId)
    ORDER BY
        DNS.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END