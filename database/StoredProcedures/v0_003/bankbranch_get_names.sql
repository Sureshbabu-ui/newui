CREATE OR ALTER PROCEDURE [dbo].[bankbranch_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		BranchId,
		BranchName 
	FROM BankBranchInfo
	WHERE IsDeleted = 0
	ORDER BY BranchName ASC;
END