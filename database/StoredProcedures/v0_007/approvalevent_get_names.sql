CREATE OR ALTER PROCEDURE [dbo].[approvalevent_get_names] 
AS
BEGIN
	SELECT 
		DISTINCT AE.Id,
		AE.EventName,
		AE.EventCode
	FROM ApprovalEvent AE 
	WHERE 
		AE.IsActive=1
	ORDER BY AE.Id ASC;
END