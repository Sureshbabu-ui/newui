CREATE OR ALTER  PROCEDURE [dbo].[eventconditionmastercolumn_list]
    @ApprovalEventId INT
AS 
BEGIN 
	SET NOCOUNT ON;

	SELECT
		ECMC.Id MasterColumnId,
		ECMC.ColumnName,
		ECMC.DisplayName ColumnDisplayName,
		ECMC.Sequence ColumnSequence,
		ECMC.ValueType,
		ECMT.Id MasterTableId,
		ECMT.DisplayName TableName,
		ECMT.Sequence TableSequence,
		AE.EventName,
		AE.IsActive,
		AE.Id ApprovalEventId
	FROM EventConditionMasterColumn ECMC
	INNER JOIN EventConditionMasterTable ECMT ON ECMT.Id = ECMC.EventConditionMasterTableId AND ECMT.IsActive = 1
	INNER JOIN ApprovalEvent AE ON AE.Id = ECMT.ApprovalEventId  AND AE.ISActive = 1
	WHERE
       AE.Id = @ApprovalEventId AND
	   ECMC.ISActive = 1
    ORDER BY ECMT.Id DESC 
END