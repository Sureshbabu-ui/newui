CREATE OR ALTER PROCEDURE [dbo].[contract_customer_site_create]
	@CreatedBy INT,
	@ContractId INT,
	@CustomerSiteId VARCHAR(32),
	@IsContractCustomerSiteCreated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @Result INT;
	DECLARE @start INT=1;
	DECLARE @length INT=0;
	DECLARE @SiteId VARCHAR(10);
    DECLARE @LastInsertedId NVARCHAR(10);
	DECLARE @ItemCount INT = (SELECT COUNT(*) FROM STRING_SPLIT(@CustomerSiteId, ','));
	DECLARE @ContractCustomerSiteCount INT = 
	(
		SELECT COUNT(Id) 
		FROM ContractCustomerSite 
		WHERE ContractCustomerSite.ContractId = @ContractId AND ContractCustomerSite.IsDeleted = 0
	)
	-- contract site count validation
	SET @Result = (
    SELECT CASE 
        WHEN SiteCount > 1 
            THEN 
                CASE WHEN SiteCount - @ContractCustomerSiteCount >= @ItemCount THEN SiteCount - @ContractCustomerSiteCount ELSE 0 END
        ELSE 
				CASE WHEN 1 - @ContractCustomerSiteCount >= @ItemCount THEN 1 - @ContractCustomerSiteCount ELSE 0 END
		END
    FROM Contract 
    WHERE Id = @ContractId
	);

	IF(@Result > 0)
	BEGIN
		SET @CustomerSiteId = @CustomerSiteId + ',';
		WHILE (@start <= LEN(@CustomerSiteId))
		BEGIN
			SET @length = (CHARINDEX(',', @CustomerSiteId, @start) - @start);
			SET @SiteId = SUBSTRING(@CustomerSiteId, @start, @length);
			INSERT INTO ContractCustomerSite (
				ContractId,
				CustomerSiteId,
				CreatedBy,
				CreatedOn,
				IsDeleted
			)
			VALUES (
				@ContractId,
				@SiteId,
				@CreatedBy,
				GETUTCDATE(),
				0
			);
			SET @start = (CHARINDEX(',', @CustomerSiteId, @start) + 1);
		END
	SET	@IsContractCustomerSiteCreated = 1
	END
	ELSE
	SET @IsContractCustomerSiteCreated = 0
END 