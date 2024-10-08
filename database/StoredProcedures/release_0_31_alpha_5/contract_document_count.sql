CREATE OR ALTER PROCEDURE [dbo].[contract_document_count]
    @Search VARCHAR(50) = NULL,
    @ContractId INT,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(ContractDocument.Id)
    FROM ContractDocument
    WHERE
        ContractDocument.ContractId = @ContractId AND
        (@Search IS NULL OR
        ContractDocument.DocumentUploadedName LIKE '%' + @Search + '%' OR
        ContractDocument.DocumentDescription LIKE '%' + @Search + '%');
END
