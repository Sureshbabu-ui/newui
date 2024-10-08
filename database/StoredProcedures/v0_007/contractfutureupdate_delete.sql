CREATE OR ALTER     PROCEDURE [dbo].[contractfutureupdate_delete]
	@Id INT=0,
	@DeletedBy INT
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE ContractFutureUpdate
	SET 
		IsDeleted=1, 
		DeletedOn= GETUTCDATE(),
		DeletedBy=@DeletedBy
	WHERE 
		Id=@Id AND
		IsDeleted != 1
END;
