CREATE OR ALTER PROCEDURE [dbo].[contract_preamc_inspection_assign_engineer]
    @PreAmcScheduleId INT,
    @EngineerId INT,
    @PlannedFrom DATE,
    @PlannedTo DATE,
    @CreatedBy INT,
    @IsEngineerScheduled INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @LastInsertedId NVARCHAR(10);
    INSERT INTO PreAmcInspectionScheduleUser 
        (PreAmcScheduleId,
        UserInfoId,
        PlannedFrom,
        PlannedTo,
		CreatedBy,
		CreatedOn,
        IsAccepted,
        IsDeleted)
    VALUES 
        (@PreAmcScheduleId,
        @EngineerId,
        @PlannedFrom,
        @PlannedTo,
		@CreatedBy,
		SYSUTCDATETIME(),
        0,
        0);
	SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
 IF (@LastInsertedId IS NOT NULL)
     SET @IsEngineerScheduled = 1
 ELSE
     SET @IsEngineerScheduled = 0
END