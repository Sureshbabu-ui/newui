CREATE OR ALTER PROCEDURE [dbo].[contract_document_create]
	@ContractId INT,
	@DocumentCategoryId INT,
	@DocumentUrl VARCHAR(256),
	@DocumentType VARCHAR(8),
	@DocumentSize INT,
	@DocumentUploadedName VARCHAR(64),
	@DocumentDescription VARCHAR(128),
	@CreatedBy INT,
	@IsDocumentCreated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @LastInsertedId NVARCHAR(10);
    INSERT INTO ContractDocument
		(ContractId,
		DocumentUrl,
		DocumentType,
		DocumentCategoryId,
		DocumentSize,
		DocumentUploadedName,
		DocumentDescription,
		CreatedBy,					
		CreatedOn)
    VALUES
		(@ContractId ,
		@DocumentUrl,
		@DocumentType,
		@DocumentCategoryId,
		@DocumentSize,  
		@DocumentUploadedName ,
		@DocumentDescription ,
		@CreatedBy,
		GETUTCDATE())
 
    SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
    IF (@LastInsertedId IS NOT NULL)
        SET @IsDocumentCreated = 1
    ELSE
        SET @IsDocumentCreated = 0
END 