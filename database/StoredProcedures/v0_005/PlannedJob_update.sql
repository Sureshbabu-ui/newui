CREATE OR ALTER    PROCEDURE [dbo].[plannedjob_update]
		@id INT
AS
BEGIN
	UPDATE PlannedJob
	SET LastRunOn = GETDATE()
	WHERE Id = @id;
END
