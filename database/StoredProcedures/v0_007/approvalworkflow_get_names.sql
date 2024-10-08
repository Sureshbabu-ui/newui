
CREATE OR ALTER PROCEDURE [dbo].[approvalworkflow_get_names]
AS
BEGIN 
    SET NOCOUNT ON;

    SELECT 
        AWF.Id,
        AWF.[Name]
    FROM
        ApprovalWorkFlow  AWF
    WHERE
		 AWF.IsActive = 1

    ORDER BY AWF.Id DESC;
END