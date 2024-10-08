CREATE OR ALTER PROCEDURE [dbo].[contract_document_details]
	@DocumentId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id, 
		DocumentUrl, 
		DocumentType, 
		DocumentDescription
	FROM ContractDocument
	WHERE 
		Id = @DocumentId
END 