CREATE OR ALTER   PROCEDURE [dbo].[customer_approvalrequest_create]
    @Content NVARCHAR(MAX),
    @CreatedBy INT,
    @CaseId INT = NULL,
    @IsUnique INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @CustomerName VARCHAR(64);
    DECLARE @CustomerId VARCHAR(64) = NULL;
	DECLARE @ReviewStatus VARCHAR(8);
	DECLARE @ReviewStatusId INT;

    SELECT 
        @CustomerName = JSON_VALUE(@Content, '$.Name'),
        @CustomerId = JSON_VALUE(@Content, '$.CustomerId'),
		@ReviewStatus = JSON_VALUE(@Content, '$.ReviewStatus')
	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = @ReviewStatus

    IF NOT EXISTS (
		SELECT 1
        FROM ApprovalRequest
			LEFT JOIN MasterEntityData MED ON MED.Id = ApprovalRequest.ReviewStatus
        WHERE 
			(JSON_VALUE(Content, '$.Name') = @CustomerName) AND 
			TableName = 'Customer' AND 
			(MED.Code != 'ARS_APRV' AND MED.Code != 'ARS_RJTD')
    )
    BEGIN
        INSERT INTO ApprovalRequest (
            CaseId,
            TableName,
            Content,
			ReviewStatus,
            CreatedBy,
            CreatedOn)
        VALUES (
            @CaseId,
            'Customer',
            @Content,
			@ReviewStatusId,
            @CreatedBy,
            GETUTCDATE());
        SET @IsUnique = 1;
    END
    ELSE
		IF (@CustomerId IS NOT NULL)
		BEGIN
		    INSERT INTO ApprovalRequest (
            CaseId,
            TableName,
            Content,
			ReviewStatus,
            CreatedBy,
            CreatedOn)
        VALUES (
            @CaseId,
            'Customer',
			@ReviewStatusId,
            @Content,
            @CreatedBy,
            GETUTCDATE());
			SET @IsUnique = 1;
		END
	ELSE SET @IsUnique = 0;
END