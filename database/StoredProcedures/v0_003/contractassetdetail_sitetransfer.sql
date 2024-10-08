CREATE OR ALTER   PROCEDURE [dbo].[contractassetdetail_sitetransfer]
    @CustomerSiteId INT,
    @AssetIdList VARCHAR(128)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @start      INT = 1;
    DECLARE @length     INT = 0;
    DECLARE @assetDetailId  INT;

    SET @AssetIdList = @AssetIdList + ',';
    WHILE(@start <= LEN(@AssetIdList))
    BEGIN
        SET @length = (CHARINDEX(',', @AssetIdList, @start) - @start);
        SET @assetDetailId = SUBSTRING(@AssetIdList, @start, @length);
        -- Update the CustomerSiteId for the corresponding assetId
		UPDATE Asset
		SET CustomerSiteId = @CustomerSiteId,
		TenantOfficeId = (SELECT TenantOfficeId FROM CustomerSite WHERE CustomerSite.Id= @CustomerSiteId)
		WHERE Id = (SELECT AssetId FROM ContractAssetDetail WHERE Id = @assetDetailId);
        SET @start = (CHARINDEX(',', @AssetIdList, @start) + 1);
    END
END;