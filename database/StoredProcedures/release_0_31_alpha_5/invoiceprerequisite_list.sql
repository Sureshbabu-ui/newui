CREATE OR ALTER PROCEDURE [dbo].[invoiceprerequisite_list]
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        IPR.Id,
        IPR.DocumentName,
        IPR.DocumentCode,
        IPR.[Description],
        IPR.IsActive,
        CreatedUser.FullName AS CreatedBy,
        IPR.CreatedOn
    FROM InvoicePrerequisite IPR
    LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = IPR.CreatedBy
    WHERE
        (@Search IS NULL OR 
        (IPR.DocumentName LIKE '%' + @Search + '%' OR 
        IPR.[Description] LIKE '%' + @Search + '%'))
    ORDER BY
        IPR.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS 
    FETCH NEXT @PerPage ROWS ONLY;
END
