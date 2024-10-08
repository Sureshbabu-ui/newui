CREATE OR ALTER PROCEDURE [dbo].[documentnumberformat_create]
    @Format VARCHAR(62),
	@DocumentTypeId INT,
	@NumberPadding INT,
    @CreatedBy INT
AS
BEGIN 
	SET NOCOUNT ON;
	
	INSERT INTO DocumentNumberFormat
		(
			DocumentTypeId,
			[Format],
			NumberPadding,
			CreatedBy,
			CreatedOn
		)
  	VALUES 
        (
			@DocumentTypeId,
			@Format,
			@NumberPadding,
			@CreatedBy,
			GETUTCDATE()
		)
END