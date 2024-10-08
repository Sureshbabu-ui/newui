CREATE OR ALTER PROCEDURE [dbo].[bankcollection_dashboard_detail] 
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @PendingCollectionCount INT
	DECLARE @PendingCollectionAmount DECIMAL(16,2)
	DECLARE @MappedCollectionCount INT
	DECLARE @MappedCollectionAmount DECIMAL(16,2)
	DECLARE @IgnoredCollectionCount INT
	DECLARE @IgnoredCollectionAmount DECIMAL(16,2)


DECLARE @FinancialMonth INT = (SELECT AppValue FROM AppSetting WHERE AppKey='FyStartMonth'); -- Change this to the desired financial month

DECLARE @FinancialYearStart DATE;
DECLARE @CurrentDate DATE;

SET @CurrentDate = GETUTCDATE();

IF MONTH(@CurrentDate) >= @FinancialMonth
BEGIN
    SET @FinancialYearStart = DATEFROMPARTS(YEAR(@CurrentDate), @FinancialMonth, 1);
END
ELSE
BEGIN
    SET @FinancialYearStart = DATEFROMPARTS(YEAR(@CurrentDate) - 1, @FinancialMonth, 1);
END

	SELECT 
		@PendingCollectionAmount = ISNULL(SUM(TransactionAmount), 0),
		@PendingCollectionCount = ISNULL(COUNT(BC.Id), 0)
	FROM BankCollection BC
	INNER JOIN MasterEntityData BankCollectionStatus ON BankCollectionStatus.Id = BC.BankCollectionStatusId
	WHERE 
		BankCollectionStatus.Code = 'BCS_PNDG' AND 
		BC.TransactionDate >= @FinancialYearStart;

	SELECT 
		@MappedCollectionAmount = ISNULL(SUM(R.ReceiptAmount), 0),
		@MappedCollectionCount = ISNULL(COUNT(R.ReceiptAmount), 0)
	FROM Receipt R
	INNER JOIN BankCollection AS BC ON BC.Id = R.BankCollectionId
	INNER JOIN MasterEntityData AS BankCollectionStatus ON BankCollectionStatus.Id = BC.BankCollectionStatusId
	WHERE 
		BankCollectionStatus.Code IN ('BCS_PRNG', 'BCS_CPLT') AND 
		BC.TransactionDate >= @FinancialYearStart;

	SELECT 
		@IgnoredCollectionAmount = ISNULL(SUM(TransactionAmount), 0),
		@IgnoredCollectionCount = ISNULL(COUNT(BC.Id), 0)
	FROM BankCollection BC
	INNER JOIN MasterEntityData AS BankCollectionStatus ON BankCollectionStatus.Id = BC.BankCollectionStatusId
	WHERE 
		BankCollectionStatus.Code = 'BCS_IGNR' AND 
		BC.TransactionDate >= @FinancialYearStart;

SELECT
	@PendingCollectionAmount AS PendingCollectionAmount,
	@PendingCollectionCount AS PendingCollectionCount,
	@MappedCollectionAmount AS MappedCollectionAmount,
	@MappedCollectionCount AS MappedCollectionCount,
	@IgnoredCollectionAmount AS IgnoredCollectionAmount,
	@IgnoredCollectionCount AS IgnoredCollectionCount
END

 