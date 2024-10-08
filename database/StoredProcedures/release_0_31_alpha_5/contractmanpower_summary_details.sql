CREATE OR ALTER PROCEDURE [dbo].[contractmanpower_summary_details]
	@ContractManpowerId	INT
AS
BEGIN
	SELECT
		Id,
		ContractId,
		CustomerSiteId,
		TenantOfficeInfoId,
		EngineerTypeId,
		EngineerLevelId,
		EngineerCount,
		EngineerMonthlyCost,
		DurationInMonth,
		CustomerAgreedAmount,
		Remarks
	FROM ContractManPower
	WHERE
		Id = @ContractManpowerId	
END
