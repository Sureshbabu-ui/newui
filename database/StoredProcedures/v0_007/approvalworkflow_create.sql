CREATE OR ALTER PROCEDURE [dbo].[approvalworkflow_create] 
    @Name varchar(16),
	@Description VARCHAR(256),
    @CreatedBy INT
AS 
BEGIN
    SET NOCOUNT ON;
    INSERT INTO ApprovalWorkflow
            ([Name],
            [Description],
            CreatedBy,
            CreatedOn)
    VALUES
            (@Name,
            @Description,
            @CreatedBy,
            GETUTCDATE())
END