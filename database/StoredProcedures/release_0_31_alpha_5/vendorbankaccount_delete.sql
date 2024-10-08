CREATE OR ALTER     PROCEDURE [dbo].[vendorbankaccount_delete]
    @Id			int,
    @DeletedBy	int
AS
BEGIN 
SET NOCOUNT ON;
	UPDATE VendorBankAccount
	SET 
		IsDeleted = 1,
		DeletedBy = @DeletedBy,
		DeletedOn = GETUTCDATE()
	WHERE 
		Id = @Id
END