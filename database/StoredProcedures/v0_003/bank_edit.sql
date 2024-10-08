CREATE OR ALTER PROCEDURE [dbo].[bank_edit]
	@Id INT,
    @BankName VARCHAR(64),
	@UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
  
    Update Bank
    SET BankName = @BankName,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END