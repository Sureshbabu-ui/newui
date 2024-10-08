CREATE OR ALTER PROCEDURE [dbo].[documentnumberformat_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @DocumentTypeId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
		DNF.Id,
        DNF.DocumentTypeId,
		DNF.IsActive,
		DNF.NumberPadding,
		DNF.[Format] AS DocumentNumberFormat,
		DocumentType.[Name] AS DocumentType
    FROM DocumentNumberFormat DNF
		LEFT JOIN MasterEntityData DocumentType ON DocumentType.Id = DNF.DocumentTypeId
    WHERE (@DocumentTypeId IS NULL OR DNF.DocumentTypeId = @DocumentTypeId)
    ORDER BY DNF.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END