CREATE OR ALTER     PROCEDURE [dbo].[plannedjob_get_list]

AS
BEGIN
	SELECT * FROM PlannedJob
	WHERE IsActive = 1;
END
