CREATE OR ALTER PROCEDURE [dbo].[contract_preamc_inspection_scheduled]
	@ContractId INT,
	@ContractCustomerSiteId VARCHAR(128)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		ScheduleNumber,
		StartsOn,
		EndsOn,
		ContractCustomerSiteId
	FROM PreAmcInspectionSchedule
	WHERE
		ContractId = @ContractId AND ContractCustomerSiteId IN (
        SELECT value 
        FROM STRING_SPLIT(@ContractCustomerSiteId, ','))
END 