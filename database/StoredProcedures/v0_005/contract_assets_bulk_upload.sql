CREATE OR ALTER   PROCEDURE [dbo].[contract_assets_bulk_upload]
	@CreatedBy INT,
    @ContractId INT,
	@AssetAddMode VARCHAR(8), 
    @AssetProductCategoryId INT = NULL,
	@Assets NVARCHAR(MAX),
	@IsProductCountExceeded INT OUTPUT,
	@ContractAssetId INT OUTPUT
AS
BEGIN     
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
    BEGIN TRAN
	DECLARE @CurrentProductCount INT;
	DECLARE @ProductCountAtBooking INT;
	DECLARE @AssetAddModeId INT;
	DECLARE @SiteNameId INT;
	DECLARE @LocationId INT;
	SELECT @AssetAddModeId = Id FROM MasterEntityData WHERE Code = @AssetAddMode
	SELECT @LocationId = JSON_VALUE(value, '$.LocatioId') FROM OPENJSON(@Assets);
	SELECT @SiteNameId = JSON_VALUE(value, '$.SiteNameId') FROM OPENJSON(@Assets);

	DECLARE  @TempAssetDetail TABLE (AssetId INT,AssetSerialNumber VARCHAR(32), IsRenewedAsset BIT, IsEnterpriseAssetId BIT, ResponseTimeInHours INT, ResolutionTimeInHours INT, StandByTimeInHours INT, CallType VARCHAR(8), IsVipAssetId BIT, AmcValue MONEY, IsOutSourcingNeededId BIT, IsPreAmcCompleted BIT, PreAmcCompletedDate DATE, PreAmcCompletedBy INT, AssetConditionId INT, IsPreventiveMaintenanceNeededId BIT, PreventiveMaintenanceFrequencyId INT, AssetSupportTypeId INT, AmcStartDate DATE, AmcEndDate DATE);;

	IF(@LocationId IS NULL)
	BEGIN
		SELECT 
			@LocationId = T.Id
		FROM 
			CustomerSite CS
			INNER JOIN TenantOffice T ON T.Id = CS.TenantOfficeId
		WHERE CS.Id = @SiteNameId
	END

	IF(@AssetProductCategoryId IS NOT NULL)
	BEGIN
		SELECT 
			@CurrentProductCount = COUNT(A.Id) 
		FROM 
			ContractAssetDetail CAD
			INNER JOIN Asset A ON A.Id = CAD.AssetId
		WHERE 
			AssetProductCategoryId = @AssetProductCategoryId AND 
			CAD.ContractId = @ContractId
		SELECT @ProductCountAtBooking = SUM(ProductCountAtBooking) FROM ContractAssetSummary  WHERE AssetProductCategoryId = @AssetProductCategoryId AND ContractId = @ContractId
	END

	IF(@ProductCountAtBooking > @CurrentProductCount OR @AssetProductCategoryId IS NULL)
	BEGIN
		INSERT INTO Asset (TenantOfficeId, CustomerSiteId, MspAssetId, CustomerAssetId, AssetProductCategoryId, ProductMakeId, ProductModelId, ProductSerialNumber, WarrantyEndDate, CreatedBy, CreatedOn)
		OUTPUT Inserted.Id,Inserted.ProductSerialNumber INTO @TempAssetDetail(AssetId,AssetSerialNumber) -- insertion into temp table
		SELECT 
			CASE WHEN LocationId IS NULL THEN @LocationId ELSE LocationId END AS LocationId,
			SiteNameId,
			AccelAssetId,
			CustomerAssetId,
			ProductCategoryId,
			ProductMakeId,
			ProductId,
			AssetSerialNumber,
			WarrantyEndDate,
			@CreatedBy,
			GETUTCDATE()
		FROM OPENJSON(@Assets) WITH (
			LocationId INT, 
			SiteNameId INT, 
			AccelAssetId VARCHAR(16), 
			CustomerAssetId VARCHAR(16), 
			ProductCategoryId INT, 
			ProductMakeId INT, 
			ProductId INT, 
			AssetSerialNumber VARCHAR(32), 
			WarrantyEndDate DATE
		);

		-- Update the temp datble with remaining details
		UPDATE TAD
		SET 
			TAD.IsEnterpriseAssetId = A.IsEnterpriseAssetId,
			TAD.IsRenewedAsset = A.IsRenewedAsset,
			TAD.ResponseTimeInHours = A.ResponseTimeInHours,
			TAD.ResolutionTimeInHours = A.ResolutionTimeInHours,
			TAD.StandByTimeInHours = A.StandByTimeInHours,
			TAD.CallType = A.CallType,
			TAD.IsVipAssetId = A.IsVipAssetId,
			TAD.AmcValue = A.AmcValue,
			TAD.IsOutSourcingNeededId = A.IsOutSourcingNeededId,
			TAD.IsPreAmcCompleted = A.IsPreAmcCompleted,
			TAD.PreAmcCompletedDate = A.PreAmcCompletedDate,
			TAD.PreAmcCompletedBy = A.PreAmcCompletedBy,
			TAD.AssetConditionId = A.AssetConditionId,
			TAD.IsPreventiveMaintenanceNeededId = A.IsPreventiveMaintenanceNeededId,
			TAD.PreventiveMaintenanceFrequencyId = A.PreventiveMaintenanceFrequencyId,
			TAD.AssetSupportTypeId = A.AssetSupportTypeId,
			TAD.AmcStartDate = A.AmcStartDate,
			TAD.AmcEndDate = A.AmcEndDate		
			FROM @TempAssetDetail TAD
			INNER JOIN (
			SELECT  AssetSerialNumber,IsRenewedAsset,IsEnterpriseAssetId, ResponseTimeInHours, ResolutionTimeInHours, StandByTimeInHours, CallType, IsVipAssetId, AmcValue, IsOutSourcingNeededId, IsPreAmcCompleted, PreAmcCompletedDate, PreAmcCompletedBy, AssetConditionId, IsPreventiveMaintenanceNeededId, PreventiveMaintenanceFrequencyId, AssetSupportTypeId, AmcStartDate, AmcEndDate
			FROM OPENJSON(@Assets)
			WITH (
				AssetSerialNumber VARCHAR(32), 
				IsRenewedAsset BIT, 
				IsEnterpriseAssetId BIT, 
				ResponseTimeInHours INT, 
				ResolutionTimeInHours INT, 
				StandByTimeInHours INT, 
				CallType VARCHAR(8), 
				IsVipAssetId BIT, 
				AmcValue MONEY, 
				IsOutSourcingNeededId BIT, 
				IsPreAmcCompleted BIT, 
				PreAmcCompletedDate DATE, 
				PreAmcCompletedBy INT, 
				AssetConditionId INT, 
				IsPreventiveMaintenanceNeededId BIT, 
				PreventiveMaintenanceFrequencyId INT, 
				AssetSupportTypeId INT, 
				AmcStartDate DATE, 
				AmcEndDate DATE
			)		
		) AS A ON TAD.AssetSerialNumber = A.AssetSerialNumber;

		--- asset details insertion
		INSERT INTO ContractAssetDetail 
				(AssetId,
				IsRenewedAsset,
				IsEnterpriseProduct,  
				ResponseTimeInHours,
				ResolutionTimeInHours,
				StandByTimeInHours,
				AssetWarrantyTypeCode,
				IsVipProduct,
				AmcValue,
				IsOutsourcingNeeded,
				IsPreAmcCompleted,
				PreAmcCompletedDate,
				PreAmcCompletedBy,
				ProductConditionId,
				IsPreventiveMaintenanceNeeded,
				PreventiveMaintenanceFrequencyId,
				ProductSupportTypeId,
				AmcStartDate,
				AmcEndDate,
				ContractId,
				AssetAddModeId,
				CreatedBy,
				CreatedOn)
			SELECT 
				AssetId,
				COALESCE(IsRenewedAsset,0),
				IsEnterpriseAssetId,
				ResponseTimeInHours,
				ResolutionTimeInHours,
				StandByTimeInHours, 
				CallType,
				IsVipAssetId,
				AmcValue, 
				IsOutSourcingNeededId,
				IsPreAmcCompleted, 
				PreAmcCompletedDate,
				PreAmcCompletedBy, 
				AssetConditionId, 
				IsPreventiveMaintenanceNeededId, 
				PreventiveMaintenanceFrequencyId,
				AssetSupportTypeId, 
				AmcStartDate,
				AmcEndDate,
				@ContractId,
				@AssetAddModeId,
				@CreatedBy,
				GETUTCDATE()
			FROM 
				@TempAssetDetail;

		SET @IsProductCountExceeded = 0
	END
	ELSE
	BEGIN
		SET @IsProductCountExceeded = 1
	END
	SET @ContractAssetId = SCOPE_IDENTITY()
COMMIT TRAN
END