CREATE OR ALTER   PROCEDURE [dbo].[contractassetdetail_update]
	@Id INT,
	@IsActive BIT,
	@ProductSerialNumber VARCHAR(32),
	@IsVipProduct BIT,
	@AmcValue MONEY,
	@IsOutsourcingNeeded BIT,
	@IsPreAmcCompleted BIT,
	@PreAmcCompletedDate DATE,
	@PreAmcCompletedBy INT,
	@AmcStartDate DATE,
	@AmcEndDate DATE,
	@ModifiedBy INT
AS 
BEGIN 
SET NOCOUNT ON;
	DECLARE @AssetId INT
	SELECT @AssetId = AssetId FROM ContractAssetDetail WHERE Id = @Id	

	UPDATE Asset SET ProductSerialNumber = @ProductSerialNumber WHERE Id = @AssetId

	UPDATE ContractAssetDetail
	SET 
		IsVipProduct					= @IsVipProduct,
		AmcValue						= @AmcValue,
		IsOutsourcingNeeded				= @IsOutsourcingNeeded,
		IsPreAmcCompleted				= @IsPreAmcCompleted,
		PreAmcCompletedDate				= @PreAmcCompletedDate,
		PreAmcCompletedBy   			= @PreAmcCompletedBy,
		AmcStartDate					= @AmcStartDate,
		AmcEndDate						= @AmcEndDate,
		ModifiedBy						= @ModifiedBy,
		ModifiedOn						= GETUTCDATE(),
		IsActive						= @IsActive
	WHERE 
		Id = @Id
END
