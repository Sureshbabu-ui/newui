CREATE OR ALTER  PROCEDURE [dbo].[approvalevent_list]
    @Search			VARCHAR(50)=NULL
AS 
BEGIN 
	SET NOCOUNT ON;

	SELECT
		AE.Id ApprovalEventId,
		AE.EventName,
		AE.IsActive,
		EG.Id EventGroupId,
		EG.EventGroupName

	FROM ApprovalEvent AE
	LEFT JOIN EventGroup EG ON EG.Id = AE.EventGroupId
	WHERE
        (ISNULL(@Search, '') = '' OR 
		EG.EventGroupName LIKE '%' + @Search + '%' OR 
		AE.EventName LIKE '%' + @Search + '%') 
    ORDER BY AE.Id DESC 
END