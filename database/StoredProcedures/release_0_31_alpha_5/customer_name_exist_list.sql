CREATE OR ALTER PROCEDURE [dbo].[customer_name_exist_list]
    @Name VARCHAR(64) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    -- Check if @Name is not NULL
    IF @Name IS NOT NULL
    BEGIN
        -- If exact match, select only that record
        IF EXISTS (SELECT 1 FROM CustomerInfo WHERE Name = @Name AND EffectiveTo IS NULL)
        BEGIN
            SELECT CustomerInfo.[Name],
                Customer.CustomerCode,
                CustomerInfo.CreatedOn,
                CustomerInfo.BilledToAddress,
                CustomerInfo.IsVerified,
                1 AS SCORE  -- Exact match, so set SCORE to 1
            FROM
                CustomerInfo
                JOIN Customer ON CustomerInfo.CustomerId = Customer.Id
            WHERE
                Name = @Name
                AND EffectiveTo IS NULL;
        END
        ELSE
        BEGIN
            -- If no exact match, select top 3 similar records
            SELECT TOP 3
                CustomerInfo.Name,
                Customer.CustomerCode,
                CustomerInfo.CreatedOn,
                CustomerInfo.BilledToAddress,
                CustomerInfo.IsVerified,
                0 AS SCORE
            FROM
                CustomerInfo
                JOIN Customer ON CustomerInfo.CustomerId = Customer.Id
            WHERE
                DIFFERENCE(CustomerInfo.Name, @Name) = 4
                AND EffectiveTo IS NULL
            ORDER BY 
                SCORE DESC;
        END
    END
END