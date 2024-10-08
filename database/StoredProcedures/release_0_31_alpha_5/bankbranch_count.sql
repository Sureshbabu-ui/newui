CREATE OR ALTER PROCEDURE [dbo].[bankbranch_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(BBI.Id)
    FROM BankBranchInfo BBI
    INNER JOIN BankBranch  BB ON BB.Id = BBI.BranchId
    WHERE 
        BBI.EffectiveTo IS NULL AND
        (@Search IS NULL OR
        (BBI.BranchName LIKE '%' + @Search + '%' OR
         BB.BranchCode LIKE '%' + @Search + '%'))
END
