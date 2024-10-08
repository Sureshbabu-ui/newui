CREATE OR ALTER   procedure [dbo].[servicerequestassignee_delete]
	@Id INT=0,
	@IsDeleted BIT=NULL,
	@DeletedReason VARCHAR(128)=NULL,
	@LoggedUserId INT=0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	Declare @DeletedOn VARCHAR(20) = NULL
	Declare @DeletedBy INT = NULL
	DEclare @EndsOn VARCHAR (20) = NULL

		SET @DeletedOn	= GETUTCDATE()
		SET @DeletedBy  = @LoggedUserId
		SET @EndsOn     = GETUTCDATE()
	IF @Id !=0
		UPDATE ServiceRequestAssignee 
		SET IsDeleted=@IsDeleted, DeletedOn= @DeletedOn,DeletedBy=@DeletedBy,DeletedReason=@DeletedReason,EndsOn=@EndsOn 
		WHERE Id=(@Id) AND IsDeleted != 1
END;