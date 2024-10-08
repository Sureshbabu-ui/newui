CREATE OR ALTER PROCEDURE [dbo].[bank_create]
    @ApprovalRequestDetailId INT =NULL,
    @UserId INT,
	@BankCode VARCHAR(3) NULL,
    @BankName VARCHAR(64) =NULL,
    @ReviewComment VARCHAR(128)=NULL
AS
BEGIN 
    SET NOCOUNT ON; 
    SET XACT_ABORT ON;
    
    DECLARE @ReviewStatusId INT;
    DECLARE @Content NVARCHAR(MAX);
	DECLARE @ApprovalRequestId INT ;
	DECLARE @CreatedBy INT;
	DECLARE @CreatedOn DATETIME =GETUTCDATE();

    BEGIN TRANSACTION;

    SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code = 'ARS_APRV';

	SET @CreatedBy =@UserId;
	  DECLARE @BankId INT = SCOPE_IDENTITY();

	IF(@ApprovalRequestDetailId IS NOT NULL)
	BEGIN
		SELECT
			@Content = AR.Content ,
			@ApprovalRequestId = AR.Id,
			@CreatedBy =AR.CreatedBy,
			@CreatedOn =AR.CreatedOn
		FROM ApprovalRequest AR
		INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId = AR.Id
		WHERE ARD.Id = @ApprovalRequestDetailId;

		SET @BankCode = JSON_VALUE(@Content, '$.BankCode');
		SET @BankName = JSON_VALUE(@Content, '$.BankName');
	END

   INSERT INTO Bank
   (
		BankCode, 
		BankName, 
		CreatedBy,
		CreatedOn, 
		IsDeleted
	)
    VALUES 
    (
		@BankCode,
		 @BankName,
		 @createdBy,
		 @CreatedOn,
          0
    );

 
 	IF(@ApprovalRequestDetailId IS NOT NULL)
	BEGIN
		UPDATE ApprovalRequest
		SET 
			IsCompleted =1,
			ApprovedRecordId =@BankId
		WHERE Id= @ApprovalRequestId

		UPDATE ApprovalRequestDetail
		SET
			ReviewedBy = @UserId,
			ReviewedOn = GETUTCDATE(),
			ReviewStatusId = @ReviewStatusId,
			ReviewComment = @ReviewComment
		WHERE Id = @ApprovalRequestDetailId;

		UPDATE ApprovalRequest
			SET ReviewStatusId = @ReviewStatusId
			WHERE Id = @ApprovalRequestId
	END

    COMMIT TRANSACTION;
END;