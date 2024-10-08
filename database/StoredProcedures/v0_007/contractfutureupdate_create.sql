
CREATE OR ALTER PROCEDURE [dbo].[contractfutureupdate_create] 
    @ContractId INT,
    @RenewedMergedContractNumber VARCHAR(32),
    @CreatedBy INT,
    @StatusId INT,
	@SubStatusId INT,
	@ProbabilityPercentage INT,
	@TargetDate VARCHAR(32) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @Count INT = (SELECT COUNT(Id) FROM ContractFutureUpdate);
    DECLARE @SerialNumber VARCHAR(3);
    SET @SerialNumber = RIGHT(REPLICATE('0', 3) + CAST(@Count + 1 AS VARCHAR(3)), 3);

    INSERT INTO ContractFutureUpdate
            (
		    ContractId,
            RenewedMergedContractNumber,
			SerialNumber,
			StatusId,
			SubStatusId,
            ProbabilityPercentage,
            TargetDate,
            CreatedBy,
            CreatedOn,
			IsDeleted
            )
    VALUES
            (
            @ContractId,
            @RenewedMergedContractNumber,
		 RIGHT('000' + CAST((@Count + 1) AS VARCHAR(3)), 3),
            @StatusId,
			@SubStatusId,
			@ProbabilityPercentage,
			@TargetDate,
			@CreatedBy,
            GETUTCDATE(),
            0
            );
END
