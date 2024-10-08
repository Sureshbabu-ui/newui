CREATE OR ALTER PROCEDURE [dbo].[contractassetpreamc_update]
	@Id INT,
	@IsPreAmcCompleted BIT,
	@PreAmcCompletedDate DATE,
	@EngineerId INT,
	@ModifiedBy INT
AS 
BEGIN 
SET NOCOUNT ON;
	UPDATE ContractAssetDetail
	SET 
		IsPreAmcCompleted				= @IsPreAmcCompleted,
		PreAmcCompletedDate				= @PreAmcCompletedDate,
		PreAmcCompletedBy   			= @EngineerId,
		ModifiedBy						= @ModifiedBy,
		ModifiedOn						= GETUTCDATE()
	WHERE 
		Id = @Id
END