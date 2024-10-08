CREATE OR ALTER   PROCEDURE [dbo].[invoiceprerequisite_create]
    @Description VARCHAR(128),
    @DocumentName VARCHAR(64),
    @DocumentCode VARCHAR(8),
    @IsActive BIT,
    @CreatedBy INT
AS 
BEGIN 
    SET NOCOUNT ON;
	INSERT INTO InvoicePrerequisite
              (DocumentName,
			  DocumentCode,
              [Description],
			  IsActive,
              CreatedBy,
              CreatedOn)
	VALUES
              (@DocumentName,
			  @DocumentCode,
			  @Description,
			  @IsActive,
              @CreatedBy,
              GETUTCDATE())
END
