CREATE OR ALTER PROCEDURE [dbo].[customergroup_update]
	@Id INT,
    @GroupName VARCHAR(64),
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
	UPDATE CustomerGroup
    SET GroupName = @GroupName
	WHERE Id = @Id
END