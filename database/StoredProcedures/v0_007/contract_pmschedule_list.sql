CREATE OR ALTER     PROCEDURE [dbo].[contract_pmschedule_list]
	@ContractId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		CPS.Id,
		CPS.PmScheduleNumber,
		CPS.PmDueDate,
		CPS.PeriodFrom,
		CPS.PeriodTo,
		COUNT(CAPD.Id) AS AssetCount
	FROM ContractPmSchedule CPS
	LEFT JOIN ContractAssetPmDetail CAPD ON CAPD.PmScheduleId = CPS.Id
	WHERE
		CPS.ContractId = @ContractId
	GROUP BY
    CPS.Id,
    CPS.PmScheduleNumber,
    CPS.PmDueDate,
    CPS.PeriodFrom,
    CPS.PeriodTo;
END