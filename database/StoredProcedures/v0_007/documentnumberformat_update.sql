CREATE OR ALTER PROCEDURE [dbo].[documentnumberformat_update]
	@Id INT,
    @Format VARCHAR(62),
	@DocumentTypeId INT,
	@NumberPadding INT,
    @ModifiedBy INT
AS
BEGIN 
	SET NOCOUNT ON;

	UPDATE DocumentNumberFormat
	SET DocumentTypeId = @DocumentTypeId,
		[Format] = @Format,
		NumberPadding = @NumberPadding,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETUTCDATE()
	WHERE Id = @Id
END