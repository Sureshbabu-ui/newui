CREATE OR ALTER PROCEDURE [dbo].[customers_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL 
AS 
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT
        C.Id AS CustomerId,
        CI.Id AS CustomerInfoId,
        CI.[Name],
        CI.PrimaryContactEmail,
        CI.PrimaryContactPhone,
        CI.IsActive,
        CI.IsVerified,
        CI.IsContractCustomer,
        C.CustomerCode
    FROM CustomerInfo CI
    JOIN Customer C ON CI.CustomerId = C.Id
    WHERE
        CI.EffectiveTo IS NULL AND
         (@Search IS NULL OR 
         CI.[Name] LIKE '%' + @Search + '%' OR 
         C.CustomerCode LIKE '%' + @Search + '%')
    ORDER BY
        CI.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
