CREATE OR ALTER PROCEDURE [dbo].[contract_document_list]
    @ContractId INT,
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @Query NVARCHAR(MAX);
    IF @Page < 1
        SET @Page = 1;

    SELECT
        D.Id,
        D.ContractId,
        D.DocumentUrl,
        D.DocumentType,
        D.DocumentSize,
        D.DocumentUploadedName,
        D.DocumentDescription,
        DC.[Name] AS DocumentCategory,
        CU.FullName AS CreatedUserName,
        MU.FullName AS ModifiedUserName
    FROM
        ContractDocument D
        LEFT JOIN UserInfo CU ON D.CreatedBy = CU.Id
        LEFT JOIN UserInfo MU ON D.ModifiedBy = MU.Id
        LEFT JOIN MasterEntityData  DC ON D.DocumentCategoryId = DC.Id
    WHERE
        D.ContractId = @ContractId AND
        D.CreatedBy = CU.Id AND
        (@Search IS NULL OR
        D.DocumentUploadedName LIKE '%' + @Search + '%' OR
        D.DocumentDescription LIKE '%' + @Search + '%')
    ORDER BY D.Id DESC
    OFFSET (@Page - 1) * @PerPage ROWS
    FETCH NEXT @PerPage ROWS ONLY;
END
