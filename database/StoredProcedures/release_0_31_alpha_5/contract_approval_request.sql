CREATE OR ALTER PROCEDURE [dbo].[contract_approval_request]
	@ContractId INT,
	@ApproverId INT,
	@ColumnName VARCHAR(16),
	@ReviewDetails NVARCHAR(MAX)
AS 
BEGIN
	SET NOCOUNT ON;
	DECLARE @Query NVARCHAR(MAX)
	DECLARE @MasterEntityDataCSId INT;
	DECLARE @ReviewedBy VARCHAR(64);
	DECLARE @ObjectCount INT;
    SELECT	@ObjectCount = COUNT(*) FROM OPENJSON(@ReviewDetails);
	SELECT  @ReviewedBy = FullName FROM UserInfo WHERE UserLoginId = (SELECT JSON_VALUE(@ReviewDetails, '$[0].UserId'))
	SELECT  @MasterEntityDataCSId = Id FROM MasterEntityData WHERE Code = 'CTS_PNDG'

	SET @ReviewDetails = JSON_MODIFY(
					JSON_MODIFY(
            JSON_MODIFY(
                @ReviewDetails, 
                '$[0].ReviewedBy', @ReviewedBy
            ),
            '$[0].CreatedOn', CONVERT(NVARCHAR(30), GETUTCDATE(), 127)
		),
        '$[0].Id',@ObjectCount
    );

	SET @Query = N'UPDATE Contract SET ' + QUOTENAME(@ColumnName) + N' = @ApproverId, ContractStatusId = @MasterEntityDataCSId, ReviewComment = @ReviewDetails WHERE Contract.Id = @ContractId'	
	EXEC sp_executesql @Query, N'@ApproverId INT, @ContractId INT, @ReviewDetails NVARCHAR(MAX), @MasterEntityDataCSId INT', @ApproverId, @ContractId, @ReviewDetails, @MasterEntityDataCSId
END