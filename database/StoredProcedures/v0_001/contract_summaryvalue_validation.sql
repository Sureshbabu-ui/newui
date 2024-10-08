CREATE OR ALTER PROCEDURE [dbo].[contract_summaryvalue_validation]
    @ContractId INT,
    @SummaryType VARCHAR(64),
    @SummaryId INT =NULL ,
    @SummaryValue DECIMAL(16,2) 
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ContractAgreedAmount DECIMAL(16,2);
    DECLARE @TotalSummaryValue DECIMAL(16,2);

    IF @SummaryType = 'Asset'
    BEGIN
        SELECT @TotalSummaryValue = SUM(AmcValue)  FROM ContractAssetSummary
        WHERE ContractId = @ContractId AND
              (@SummaryId IS NULL OR Id != @SummaryId);
		 SELECT @ContractAgreedAmount = AmcValue FROM [Contract] WHERE Id = @ContractId;
    END
    ELSE IF @SummaryType = 'ManPower'
    BEGIN
        SELECT @TotalSummaryValue = SUM(CustomerAgreedAmount) FROM ContractManPower
        WHERE ContractManPower.ContractId = @ContractId AND
              (@SummaryId IS NULL OR Id != @SummaryId);

        SELECT @ContractAgreedAmount = FmsValue  FROM [Contract] WHERE Id = @ContractId;
    END

        SELECT CASE 
            WHEN (ISNULL(@TotalSummaryValue,0.00) + ISNULL(@SummaryValue,0.00)) > ISNULL(@ContractAgreedAmount,0) THEN 1
            ELSE 0
        END AS IsValueExceeded; 
END;
