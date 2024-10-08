CREATE OR ALTER  PROCEDURE [dbo].[vendorbranch_delete]
    @Id			int,
    @DeletedBy	int
AS
BEGIN 
SET NOCOUNT ON;

UPDATE VendorBranch
SET 
    IsDeleted = 1,
    DeletedBy = @DeletedBy,
    DeletedOn = GETUTCDATE()
WHERE 
    Id = @Id
END