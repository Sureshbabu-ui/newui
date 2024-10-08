CREATE OR ALTER PROCEDURE [dbo].[einvoice_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT
        Id,
        Invoiceno,
        EISent,
        EISuccess,
        CreatedOn
    FROM SalesRegisterHeader
    WHERE
        (@Search IS NULL OR 
        Invoiceno LIKE '%' + @Search + '%')
    ORDER BY
        Id DESC 
    OFFSET
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
