CREATE OR ALTER PROCEDURE [dbo].[customersite_delete]
	@Id INT=0,
	@DeletedBy INT
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE CustomerSite
	SET 
		IsDeleted=1, 
		IsACtive = 0,
		DeletedOn= GETUTCDATE(),
		DeletedBy=@DeletedBy
	WHERE 
		Id=@Id AND
		IsDeleted != 1
END;