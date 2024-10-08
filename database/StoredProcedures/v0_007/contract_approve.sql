CREATE OR ALTER PROCEDURE [dbo].[contract_approve]

	@ContractId INT,
	@ColumnName VARCHAR(16),
	@ReviewDetails NVARCHAR(MAX)
AS 
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
    BEGIN TRANSACTION;
	DECLARE @Query NVARCHAR(MAX)
	DECLARE @ReviewedBy VARCHAR(64);
	DECLARE @ObjectCount INT;

    SELECT	@ObjectCount = COUNT(*) FROM OPENJSON(@ReviewDetails);
	SELECT  @ReviewedBy = FullName FROM UserInfo WHERE UserLoginId = (SELECT JSON_VALUE(@ReviewDetails, '$[0].UserId'))

	SET @ReviewDetails = JSON_MODIFY(
					JSON_MODIFY(
            JSON_MODIFY(
                @ReviewDetails, 
                '$[0].ReviewedBy', @ReviewedBy
            ),
            '$[0].CreatedOn', CONVERT(NVARCHAR(30), GETUTCDATE(), 127)
		),
        '$[0].Id',@ObjectCount 
    )
  
   IF(@ColumnName='FirstApprovedOn')
		SET @Query = N'UPDATE Contract SET ' + QUOTENAME(@ColumnName) + N' = GETUTCDATE(), ReviewComment = @ReviewDetails WHERE Contract.Id = @ContractId'	
	ELSE IF(@ColumnName='SecondApprovedOn')
	BEGIN
	
	--Code to generate contract number in the format specified in business setting--
    DECLARE @TenantOfficeId INT = (SELECT TenantOfficeId From  Contract WHERE Contract.Id= @ContractId);
	  
	DECLARE @MasterEntityDataCSId INT;
	SELECT @MasterEntityDataCSId = Id FROM MasterEntityData WHERE Code = 'CTS_APRV'

	DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @Year INT = YEAR(@CurrentDate)
	DECLARE @Month INT = MONTH(@CurrentDate)
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
	SET @Year=@Year%100;
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	DECLARE @DocumentNumber VARCHAR(32);
    DECLARE @ContractNumber VARCHAR(32);
    EXEC [dbo].[documentnumberformat_get_nextnumber]
        @DocumentTypeCode = 'DCT_CNTR',
        @TenantOfficeId = @TenantOfficeId,
		@Year = @Year,
        @DocumentNumber = @DocumentNumber OUTPUT;
	SET @ContractNumber = @DocumentNumber


		SET @Query = N'UPDATE Contract SET ' + QUOTENAME(@ColumnName) + N' = GETUTCDATE(),ContractNumber=  @ContractNumber, ContractStatusId = @MasterEntityDataCSId, ReviewComment = @ReviewDetails WHERE Contract.Id = @ContractId'	
  
  END
  EXEC	sp_executesql @Query, N'@ReviewDetails NVARCHAR(MAX), @ContractId INT, @ContractNumber NVARCHAR(32),@MasterEntityDataCSId INT', @ReviewDetails, @ContractId,@ContractNumber,@MasterEntityDataCSId
 COMMIT TRANSACTION;

END