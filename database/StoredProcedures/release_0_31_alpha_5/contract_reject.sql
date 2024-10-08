CREATE OR ALTER   PROCEDURE [dbo].[contract_reject]
	@ContractId INT,
	@ReviewDetails NVARCHAR(MAX)
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @Query NVARCHAR(MAX)
	DECLARE @ContractStatusId INT;
	DECLARE @ReviewedBy VARCHAR(64);
    DECLARE @ObjectCount INT;
    SELECT	@ObjectCount = COUNT(*) FROM OPENJSON(@ReviewDetails);
	SELECT  @ContractStatusId = Id FROM MasterEntityData WHERE Code = 'CTS_RJTD';
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
		ReviewComment = @ReviewDetails
	WHERE
		Contract.Id = @ContractId
END
