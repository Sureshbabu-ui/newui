CREATE OR ALTER PROCEDURE [dbo].[contractfutureupdate_update]
    @Id INT,
    @StatusId INT,
    @SubStatusId INT,
    @ProbabilityPercentage INT,
    @TargetDate VARCHAR(32) = NULL,
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;

    UPDATE ContractFutureUpdate
    SET 
        StatusId = @StatusId,
        SubStatusId = @SubStatusId,
        ProbabilityPercentage = @ProbabilityPercentage,
        TargetDate = @TargetDate,
        UpdatedBy = @UpdatedBy
    WHERE Id = @Id;
END
