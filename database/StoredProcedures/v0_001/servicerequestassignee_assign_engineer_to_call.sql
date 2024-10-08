CREATE OR ALTER PROCEDURE [dbo].[servicerequestassignee_assign_engineer_to_call]
    @AssigneeId VARCHAR(128), 
    @StartsFrom DATETIME,
    @ServiceRequestId INT,
    @Remarks VARCHAR(128),
    @CreatedBy INT,
    @IsFirstAssignment BIT = NULL,
    @IsEngineerAssigned INT OUTPUT
AS
BEGIN
    DECLARE @CaseStatusId INT;
    DECLARE @ServiceRequestAssignmentId INT;
    DECLARE @ActiveEngineerId INT;
    DECLARE @FirstIteration BIT = 1;

    SELECT @CaseStatusId = Id FROM MasterEntityData WHERE Code = 'SRS_SFDG';
    SELECT @ActiveEngineerId = COUNT(Id) FROM ServiceRequestAssignee WHERE ServiceRequestId = @ServiceRequestId AND EndsOn IS NULL;

    -- Start a transaction
    BEGIN TRANSACTION;
    SET XACT_ABORT ON;
    SET NOCOUNT ON;

    -- Iterate through each AssigneeId
    DECLARE AssigneeCursor CURSOR FOR 
    SELECT VALUE
    FROM STRING_SPLIT(@AssigneeId, ',');

    OPEN AssigneeCursor;

    FETCH NEXT FROM AssigneeCursor INTO @AssigneeId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Insert a new record into ServiceRequestAssignee
        INSERT INTO ServiceRequestAssignee (
            ServiceRequestId,
            AssigneeId,
            Remarks,
            StartsFrom,
            CreatedBy,
            CreatedOn
        )
        VALUES (
            @ServiceRequestId,
            @AssigneeId,
            @Remarks,
            @StartsFrom,
            @CreatedBy,
            GETUTCDATE()
        );

        SET @ServiceRequestAssignmentId = SCOPE_IDENTITY();

        IF @FirstIteration = 1 AND (@IsFirstAssignment = 1 OR @ActiveEngineerId = 0)
        BEGIN
            UPDATE ServiceRequest
            SET CaseStatusId = @CaseStatusId,
                ServiceRequestAssignmentId = @ServiceRequestAssignmentId
            WHERE Id = @ServiceRequestId;

            SET @FirstIteration = 0;
        END

        -- Fetch the next AssigneeId
        FETCH NEXT FROM AssigneeCursor INTO @AssigneeId;
    END

    CLOSE AssigneeCursor;
    DEALLOCATE AssigneeCursor;

    SET @IsEngineerAssigned = 1;

    -- Commit the transaction
    COMMIT TRANSACTION;
END