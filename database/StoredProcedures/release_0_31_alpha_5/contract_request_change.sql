CREATE OR ALTER   PROCEDURE [dbo].[contract_request_change]
	@ContractId INT,
	@ReviewDetails NVARCHAR(MAX)
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @ReviewedBy VARCHAR(64);
	DECLARE @Query NVARCHAR(MAX)
	DECLARE @ContractStatusId INT;
    DECLARE @ObjectCount INT;
    SELECT	@ObjectCount = COUNT(*) FROM OPENJSON(@ReviewDetails);
	SELECT  @ContractStatusId = Id FROM MasterEntityData WHERE Code = 'CTS_PGRS'
	SELECT  @ReviewedBy = FullName FROM UserInfo WHERE UserLoginId = (SELECT JSON_VALUE(@ReviewDetails, '$[0].UserId'))

	SET @ReviewDetails = JSON_MODIFY(
					JSON_MODIFY(
            JSON_MODIFY(
                @ReviewDetails, 
                '$[0].ReviewedBy', @ReviewedBy
            ),
            '$[0].CreatedOn', CONVERT(NVARCHAR(30), GETUTCDATE(), 127)
		),
          '$[0].Id', @ObjectCount
      )

	UPDATE Contract 
	SET ContractStatusId =	@ContractStatusId,
		FirstApproverId = NULL,
		FirstApprovedOn = NULL,
		SecondApproverId = NULL,
		ReviewComment = @ReviewDetails
	WHERE
		Contract.Id = @ContractId
END