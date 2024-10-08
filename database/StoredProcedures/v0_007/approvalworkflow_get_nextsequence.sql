CREATE OR ALTER PROCEDURE [dbo].[approvalworkflow_get_nextsequence]
    @ApprovalEventCode VARCHAR(32),
    @ApprovalRequestDetailId INT = NULL,
    @LoggedUserId INT = NULL,
    @RequestJson NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @CurrentSequence INT = 0;
    DECLARE @NextSequence INT = 0;
    DECLARE @EventConditionId INT = NULL;
    DECLARE @ConditionValue NVARCHAR(MAX);
    DECLARE @Condition NVARCHAR(MAX);
    DECLARE @ConditionResult BIT;
    DECLARE @Sequence INT;
    DECLARE @FoundMatch BIT = 0;
    DECLARE @Id INT;


    IF @ApprovalRequestDetailId IS NULL
    BEGIN
        -- Cursor to iterate through the EventCondition table ordered by Sequence
        DECLARE ConditionCursor CURSOR FOR
        SELECT 
			EC.Id,
			EC.ConditionValue, 
			EC.Sequence
        FROM EventCondition EC
		INNER JOIN ApprovalEvent AE ON AE.Id =EC.ApprovalEventId
        WHERE 
			EC.IsActive = 1 AND
            AE.EventCode = @ApprovalEventCode
        ORDER BY Sequence ASC;

        OPEN ConditionCursor;

        FETCH NEXT FROM ConditionCursor INTO @Id, @ConditionValue, @Sequence;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- If ConditionValue is NULL, consider it as a match if no other match is found
            IF @ConditionValue IS NULL
            BEGIN
                IF @FoundMatch = 0
                BEGIN
                    SET @ConditionResult = 1;
					SET @EventConditionId = @Id;
                END
            END
            ELSE
            BEGIN
                -- Replace variables in ConditionValue with values from JSON
                SET @Condition = @ConditionValue;
                DECLARE @JsonKey NVARCHAR(255);
                DECLARE @JsonValue NVARCHAR(255);

                DECLARE JsonCursor CURSOR FOR
                SELECT [key], [value]
                FROM OPENJSON(@RequestJson);

                OPEN JsonCursor;

                FETCH NEXT FROM JsonCursor INTO @JsonKey, @JsonValue;

                WHILE @@FETCH_STATUS = 0
                BEGIN
                    -- Replace each @Variable in the condition with the corresponding value from JSON
                    SET @Condition = REPLACE(@Condition, '@' + @JsonKey, ISNULL(@JsonValue,''));
                    FETCH NEXT FROM JsonCursor INTO @JsonKey, @JsonValue;
                END;

                CLOSE JsonCursor;
                DEALLOCATE JsonCursor;

                -- Debugging: Final condition before execution

                -- Check if @Condition is valid before execution
                IF @Condition IS NOT NULL AND LEN(@Condition) > 0
                BEGIN
                    -- Dynamic SQL to evaluate the condition
                    DECLARE @SQL NVARCHAR(MAX);
                    SET @SQL = 'IF ' + @Condition + ' BEGIN SET @ConditionResult = 1; END ELSE BEGIN SET @ConditionResult = 0; END';

                    -- Execute the dynamic SQL
                    EXEC sp_executesql @SQL, N'@ConditionResult BIT OUTPUT', @ConditionResult OUTPUT;
                END
                ELSE
                BEGIN
                    -- If condition is invalid, set the result to 0 (no match)
                    SET @ConditionResult = 0;
                END;
            END;

            -- If the condition is true, set the match flag and EventConditionId, then break the loop
            IF @ConditionResult = 1
            BEGIN
                SET @FoundMatch = 1;
                SET @EventConditionId = @Id; 
                BREAK;
            END;

            FETCH NEXT FROM ConditionCursor INTO @Id, @ConditionValue, @Sequence;
        END;

        CLOSE ConditionCursor;
        DEALLOCATE ConditionCursor;

        ---- If no match found, fall back to a record where ConditionValue is NULL
        --IF @FoundMatch = 0
        --BEGIN
        --    SET @EventConditionId = (
        --        SELECT TOP 1 Id
        --        FROM EventCondition
        --        WHERE IsActive = 1 AND ConditionValue IS NULL
        --        ORDER BY Sequence ASC
        --    );
        --END
    END
    ELSE
    BEGIN
        -- Get the current sequence if ApprovalRequestDetailId is provided
         
            SELECT  @CurrentSequence = ARD.[Sequence] ,
			@EventConditionId= AR.EventConditionId
            FROM ApprovalRequest AR
            INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId = AR.Id
            WHERE ARD.Id = @ApprovalRequestDetailId ;
        
    END

	

    -- Get the next sequence in the approval workflow
    SELECT TOP 1 @NextSequence = AFd.[Sequence]
    FROM ApprovalWorkflowDetail AFD
    INNER JOIN ApprovalWorkflow AF ON AFD.ApprovalWorkflowId = AF.Id AND AF.IsActive = 1
	INNER JOIN EventCondition EC ON EC.ApprovalWorkflowId = AF.Id
    WHERE EC.Id = @EventConditionId
      AND AFD.IsActive = 1 
      AND AFD.[Sequence] > @CurrentSequence
    ORDER BY AFD.[Sequence];

    -- Return the next approval step details
    IF(@NextSequence > 0)
    BEGIN
        SELECT DISTINCT 
            EC.Id AS EventConditionId,
            AFD.[Sequence],
            AFD.ApproverRoleId,
            AFD.ApproverUserId
        FROM ApprovalWorkflowDetail AFD
        INNER JOIN ApprovalWorkflow AF ON AFD.ApprovalWorkflowId = AF.Id AND AF.IsActive = 1
		INNER JOIN EventCondition EC ON EC.ApprovalWorkflowId = AF.Id
        WHERE EC.Id = @EventConditionId
          AND AFD.IsActive = 1 
          AND AFD.Sequence = @NextSequence
    END
END;
