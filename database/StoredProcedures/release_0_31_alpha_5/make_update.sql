CREATE OR ALTER PROCEDURE [dbo].[make_update] 
	@MakeId INT,
    @Name VARCHAR(64),
	@UpdatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE	Make
	SET
		[Name]	  = @Name,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE
		Id = @MakeId;
END