CREATE OR ALTER PROCEDURE [dbo].[contract_preamc_get_assigned_engineer_schedule_details]
    @EngineerId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        PlannedFrom,
        PlannedTo,
        UserInfoId AS EngineerId
    FROM PreAmcInspectionScheduleUser
    WHERE 
        UserInfoId = @EngineerId;
END;