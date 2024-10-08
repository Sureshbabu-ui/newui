CREATE OR ALTER PROCEDURE[dbo].[serviceengineervisit_start]
    @ServiceRequestAssignmentId INT,
    @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	INSERT INTO serviceEngineerVisit
	(
	ServiceRequestAssignmentId,
		StartsOn,
		CreatedBy,
		CreatedOn
		)
VALUES
	(@ServiceRequestAssignmentId,
GETUTCDATE(),
@CreatedBy,
	GETUTCDATE()
	)
END 
