CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_partcodification_create]
    @Content NVARCHAR(MAX),
    @CreatedBy INT,
    @IsUnique INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @PartName VARCHAR(64);
    DECLARE @ReviewStatusId INT;
	DECLARE @ReviewStatus VARCHAR(8);
     
    SET @PartName = JSON_VALUE(@Content, '$.PartName');

    IF NOT EXISTS 
	(
        SELECT 1
        FROM ApprovalRequest
        WHERE 
		TableName ='Part' AND
		JSON_VALUE(Content, '$.PartName') = @PartName
    )
	BEGIN
		INSERT INTO ApprovalRequest 
			(
			CaseId,
			TableName,
			Content,
			CreatedBy,
			CreatedOn,
			ReviewStatus
			)
		VALUES 
			(
			0,
			'Part',
			@Content,
			@CreatedBy,
			GETUTCDATE(),
			(SELECT Id FROM MasterEntityData WHERE Code='ARS_SMTD')
			);
		SET @IsUnique = 1;
	END
    ELSE
		SET @IsUnique = 0;
END