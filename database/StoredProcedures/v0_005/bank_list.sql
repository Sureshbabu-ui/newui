CREATE OR ALTER PROCEDURE [dbo].[bank_list]
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;
    SELECT
        B.Id,
        B.BankCode,
        B.BankName,
        CU.FullName AS CreatedBy,
        B.CreatedOn
    FROM Bank B
    LEFT JOIN UserInfo CU ON B.CreatedBy = CU.Id
    WHERE 
        @Search IS NULL OR 
        (B.BankName LIKE '%' + @Search + '%' OR
        B.BankCode LIKE '%' + @Search + '%')
    ORDER BY 
        B.Id DESC
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END
