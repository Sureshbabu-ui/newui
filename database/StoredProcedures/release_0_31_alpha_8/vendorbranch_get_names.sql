CREATE OR ALTER PROCEDURE [dbo].[vendorbranch_get_names]
    @VendorId INT
AS
BEGIN 
SET NOCOUNT ON;
	SELECT 
		VB.Id,
		VB.[Name] AS BranchName ,
		VB.[Address],
		S.GstStateCode
	FROM 
		VendorBranch VB
		LEFT JOIN [State] S ON S.Id = VB.StateId
	WHERE
		VendorId = @VendorId AND
		VB.IsActive = 1 AND
		VB.IsDeleted = 0
	ORDER BY VB.[Name] ASC;
END