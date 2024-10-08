CREATE OR ALTER PROCEDURE [dbo].[contract_preamc_inspection_assigned_engineers]
	@ContractId INT,
	@PreAmcScheduleId VARCHAR(128)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		PreAmcInspectionSchedule.Id,
		UserInfo.FullName AS EngineerName,
		PreAmcInspectionScheduleUser.PlannedFrom,
		PreAmcInspectionScheduleUser.PlannedTo,
		PreAmcInspectionScheduleUser.ExecutedFrom,
		PreAmcInspectionScheduleUser.ExecutedTo,
		AssignedByUser.FullName AS AssignedBy,
		PreAmcInspectionSchedule.ContractCustomerSiteId,
		PreAmcInspectionScheduleUser.CreatedOn AS AssignedOn
	FROM PreAmcInspectionSchedule
	JOIN PreAmcInspectionScheduleUser ON PreAmcInspectionSchedule.Id = PreAmcInspectionScheduleUser.PreAmcScheduleId
	JOIN UserInfo ON PreAmcInspectionScheduleUser.UserInfoId = UserInfo.Id
	JOIN UserInfo  AssignedByUser ON AssignedByUser.Id = PreAmcInspectionScheduleUser.CreatedBy
	WHERE
		PreAmcInspectionSchedule.ContractId = @ContractId AND PreAmcInspectionSchedule.Id IN (
        SELECT value 
        FROM STRING_SPLIT(@PreAmcScheduleId, ','))
END 
