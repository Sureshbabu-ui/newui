CREATE OR ALTER PROCEDURE [dbo].[tenantbankaccount_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @TenantId    INT,
    @Search      VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
	IF @Page < 1
        SET @Page = 1;

    SELECT 
        TBA.Id,
        BBI.BranchName,
        TBA.RelationshipManager,
        TBA.ContactNumber,
        TBA.AccountNumber
    FROM 
        BankBranchInfo BBI            
        LEFT JOIN TenantBankAccount TBA ON BBI.Id = TBA.BankBranchInfoId
    WHERE 
        TBA.IsActive = 1 OR TBA.IsDeleted = 0 AND
        TBA.TenantId = @TenantId AND
        (@Search IS NULL OR
        BBI.BranchName LIKE '%' + @Search + '%' OR
        TBA.RelationshipManager LIKE '%' + @Search + '%' OR
        TBA.AccountNumber LIKE '%' + @Search + '%')
    ORDER BY TBA.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END