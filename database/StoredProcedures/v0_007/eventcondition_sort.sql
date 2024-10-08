CREATE OR ALTER PROCEDURE [dbo].[eventcondition_sort]
    @EventConditions NVARCHAR(MAX),
	@ApprovalEventId INT,
    @UpdatedBy INT
AS 
BEGIN 
    BEGIN TRANSACTION 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    UPDATE EC
    SET 
        EC.Sequence = JSONData.Sequence,
		EC.UpdatedON = GETUTCDATE(),
		EC.UpdatedBy = @UpdatedBy		
    FROM 
        EventCondition EC
    INNER JOIN 
        OPENJSON(@EventConditions)
        WITH (
            Id INT,
            Sequence INT
        ) AS JSONData
    ON 
        EC.Id = JSONData.Id
    WHERE 
        EC.Sequence <> JSONData.Sequence;

    COMMIT TRANSACTION;
END;
