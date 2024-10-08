CREATE OR ALTER PROCEDURE [dbo].[contractassetsummary_update] 
	@Id INT,
	@ContractId INT,
	@ProductCategoryId INT,
	@PartCategoryList VARCHAR(128),
	@ProductCountAtBooking INT,
	@AmcValue DECIMAL(16,2),
	@UpdatedBy INT
AS
BEGIN 
    DECLARE @Start INT=1;
	DECLARE @Length	INT=0;
	DECLARE @PartCategoryId INT;
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	BEGIN TRANSACTION
	UPDATE	ContractAssetSummary
    SET
        AmcValue = @AmcValue,
		AssetProductCategoryId = @ProductCategoryId,
		ProductCountAtBooking = @ProductCountAtBooking,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
    WHERE
        Id = @Id;
			 
	UPDATE
        ContractProductCategoryPartNotCovered
    SET
        IsDeleted = 1,
		DeletedBy= @UpdatedBy,
		DeletedOn = GETUTCDATE()
    WHERE
        ContractId = @ContractId AND AssetProductCategoryId = @ProductCategoryId
        AND PartCategoryId NOT IN (
            SELECT
                CAST(VALUE AS INT)
            FROM
                STRING_SPLIT(@PartCategoryList, ',')
        )
        AND DeletedOn IS NULL;

    SET @PartCategoryList = @PartCategoryList + ',';
    WHILE (@start <= LEN(@PartCategoryList)) 
		
	BEGIN
        SET @length = (CHARINDEX(',', @PartCategoryList, @start) - @start);
        SET @PartCategoryId = SUBSTRING(@PartCategoryList, @start, @length);

        IF @PartCategoryId IS NOT NULL
            AND @PartCategoryId != ''
        BEGIN 
            IF EXISTS (
                SELECT
                    *
                FROM
                    ContractProductCategoryPartNotCovered
                WHERE
                    ContractId = @ContractId 
					AND AssetProductCategoryId = @ProductCategoryId
                    AND PartCategoryId = @PartCategoryId
                    AND DeletedOn IS NULL
            )
            BEGIN
                UPDATE
                    ContractProductCategoryPartNotCovered
                SET
					CreatedBy = @UpdatedBy,
                    CreatedOn = GETUTCDATE() 
                WHERE
                    ContractId = @ContractId 
					AND AssetProductCategoryId = @ProductCategoryId
                    AND PartCategoryId = @PartCategoryId
                    AND DeletedOn IS NULL
            END
            ELSE
            BEGIN
                INSERT INTO ContractProductCategoryPartNotCovered
				(
					ContractId,AssetProductCategoryId,PartCategoryId,CreatedBy,CreatedOn
				) 
				VALUES
				(
					@ContractId,@ProductCategoryId,@PartCategoryId,@UpdatedBy,GETUTCDATE()
				);
            END
        END
        SET
            @start = (CHARINDEX(',', @PartCategoryList, @start) + 1);
    END
	COMMIT TRANSACTION;
END