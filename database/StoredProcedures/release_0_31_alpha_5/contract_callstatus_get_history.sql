CREATE OR ALTER PROCEDURE [dbo].[contract_callstatus_get_history]
	@ContractId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CCSH.ResetDate,
		CCSH.ResetReason,
		CCSH.CreatedOn,
		CCSH.StopDate,
		CCSH.StopReason,
		CCSH.UpdatedOn,
		RB.FullName AS ResetBy,
		SB.FullName AS StoppedBy
	FROM contractCallStopHistory CCSH
	LEFT JOIN UserInfo RB ON RB.Id =  CCSH.ResetBy
	LEFT JOIN UserInfo SB ON  SB.Id = CCSH.StoppedBy
	WHERE 
		CCSH.ContractId = @ContractId
	ORDER BY CCSH.CreatedOn DESC
END  