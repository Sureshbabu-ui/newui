CREATE OR ALTER PROCEDURE [dbo].[contract_callstatus_update] 
    @ContractId INT,
    @Reason VARCHAR(128),
    @CallStopDate DATE,
    @Status BIT,
	@CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION
    UPDATE [Contract]
    SET
        [Contract].CallStopDate=CASE WHEN (@Status = 1) THEN NULL ELSE @CallStopDate END,
        [Contract].CallStopReason=CASE WHEN (@Status = 1) THEN NULL ELSE @Reason END
    WHERE
        Id = @ContractId;
    IF(@Status=0)
BEGIN
    INSERT INTO ContractCallStopHistory
        (ContractId,
        StopDate,
        StopReason,
        StoppedBy,
        CreatedOn)
    VALUES
        (@ContractId,
        @CallStopDate,
        @Reason,
        @CreatedBy,
        GETUTCDATE());
END
    ELSE
BEGIN
    UPDATE 
        ContractCallStopHistory
    SET
        ResetDate=@CallStopDate,
        ResetReason=@Reason,
        ResetBy=@CreatedBy,
        UpdatedOn = GETUTCDATE()
    WHERE 
        Id=(SELECT MAX(Id) FROM ContractCallStopHistory WHERE ContractId=@ContractId)
END
    COMMIT TRANSACTION;
END