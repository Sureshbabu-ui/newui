CREATE OR ALTER PROCEDURE [dbo].[tenantbankaccount_count]
    @Search     VARCHAR(50) = NULL,
    @TenantId INT,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(TBA.Id) 
    FROM TenantBankAccount TBA
        LEFT JOIN BankBranchInfo BBI ON BBI.Id = TBA.BankBranchInfoId
    WHERE 
        TBA.IsActive IS NOT NULL AND
        TBA.TenantId = @TenantId AND
        (@Search IS NULL OR
        BBI.BranchName LIKE '%' + @Search + '%' OR
        TBA.RelationshipManager LIKE '%' + @Search + '%' OR
        TBA.AccountNumber LIKE '%' + @Search + '%') 
END