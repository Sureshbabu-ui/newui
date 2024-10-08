CREATE OR ALTER  PROCEDURE [dbo].[productcategorypartsnotcovered_update] 
    @ProductCategoryId INT,
    @PartCategoryData NVARCHAR(128),
    @CreatedBy INT,
    @IsPartNotCoveredUpdated INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    
    DECLARE @Id INT;
    DECLARE @IsActive INT;

    DECLARE @PartsCategoryTable TABLE (PartCId INT, IsActive INT);

    WHILE LEN(@PartCategoryData) > 0
    BEGIN
        SET @Id = CAST(LEFT(@PartCategoryData, CHARINDEX('.', @PartCategoryData + '.') - 1) AS INT);
        SET @PartCategoryData = SUBSTRING(@PartCategoryData, CHARINDEX('.', @PartCategoryData + '.') + 1, LEN(@PartCategoryData));
        
        SET @IsActive = CAST(LEFT(@PartCategoryData, CHARINDEX(',', @PartCategoryData + ',') - 1) AS INT);
        SET @PartCategoryData = SUBSTRING(@PartCategoryData, CHARINDEX(',', @PartCategoryData + ',') + 1, LEN(@PartCategoryData));

        INSERT INTO @PartsCategoryTable (PartCId, IsActive)
        VALUES (@Id, @IsActive);
    END

    MERGE INTO AssetProductCategoryPartNotCovered AS targetTable
    USING (SELECT PartCId, IsActive FROM @PartsCategoryTable) AS tempTable
    ON (targetTable.PartCategoryId = tempTable.PartCId AND targetTable.AssetProductCategoryId = @ProductCategoryId)
    WHEN MATCHED THEN
        UPDATE SET targetTable.IsActive = tempTable.IsActive
    WHEN NOT MATCHED THEN
        INSERT (PartCategoryId, AssetProductCategoryId, IsActive, CreatedBy, CreatedOn)
        VALUES (tempTable.PartCId, @ProductCategoryId, tempTable.IsActive, @CreatedBy, GETUTCDATE());

    SET @IsPartNotCoveredUpdated = 1;
END