CREATE OR ALTER PROCEDURE [dbo].[approvalworkflow_update]
	@Id INT,
	@Name VARCHAR(64),
	@Description VARCHAR(256),
	@IsActive BIT,

    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
	UPDATE ApprovalWorkflow
	SET 
		[Name] = @Name,
		[Description]= @Description,
		IsActive = @IsActive,	
	    ModifiedBy = @UpdatedBy,
		ModifiedOn = GETUTCDATE()
	WHERE Id = @Id
END