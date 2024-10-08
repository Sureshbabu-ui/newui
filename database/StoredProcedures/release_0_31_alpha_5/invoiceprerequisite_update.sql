CREATE OR ALTER PROCEDURE [dbo].[invoiceprerequisite_update] 
	@Id INT,
    @IsActive BIT,
	@UpdatedBy INT,
	@IsInvoicePrerequisiteUpdated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE InvoicePrerequisite
	SET
		IsActive = @IsActive,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE
		Id = @Id;
	SET @IsInvoicePrerequisiteUpdated = 1;
END