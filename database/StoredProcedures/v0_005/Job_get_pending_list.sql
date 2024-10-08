CREATE OR ALTER     PROCEDURE [dbo].[job_get_pending_list]
	@limit int
AS
BEGIN
	SELECT TOP (@limit) * FROM dbo.Job
	WHERE IsCompleted = 0
END
