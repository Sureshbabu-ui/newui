CREATE OR ALTER PROCEDURE [dbo].[contract_value_validation]
    @ContractId INT,
    @NewAmcValue DECIMAL(16,2) = 0.00,
    @NewFmsValue DECIMAL(16,2) = 0.00
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FmsSummaryValue DECIMAL(16,2);
    DECLARE @AmcSummaryValue DECIMAL(16,2);

        SELECT @AmcSummaryValue = ISNULL(SUM(AmcValue),0)  FROM ContractAssetSummary
        WHERE ContractId = @ContractId ;

        SELECT @FmsSummaryValue = ISNULL(SUM(CustomerAgreedAmount),0) FROM ContractManPower
        WHERE ContractManPower.ContractId = @ContractId;

        SELECT CASE 
            WHEN  @AmcSummaryValue > @NewAmcValue  THEN 1
            ELSE 0
        END AS IsAmcValueExceeded,
        CASE 
            WHEN  @FmsSummaryValue > @NewFmsValue  THEN 1
            ELSE 0
        END AS IsFmsValueExceeded; 
END
