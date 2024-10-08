CREATE OR ALTER  PROCEDURE [dbo].[contract_callstop_count_details]
	@TotalCallStopped INT OUTPUT ,
	@Tonightcallstop INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @MasterEntityDataCSId INT;
	SELECT @MasterEntityDataCSId = Id FROM MasterEntityData WHERE Code = 'CTS_APRV'
	SET @Tonightcallstop = (SELECT 
					COUNT(*) AS CallStopCount
				FROM 
					Contract
				WHERE 
					Contract.CallStopDate = CAST(GETDATE() AS DATE) AND Contract.ContractStatusId = @MasterEntityDataCSId)

	SET @TotalCallStopped = (SELECT 
						COUNT(*) AS CallStopCount
						FROM 
							Contract
						WHERE 
							Contract.CallStopDate <  CAST(GETDATE() AS DATE) AND Contract.ContractStatusId = @MasterEntityDataCSId)
END