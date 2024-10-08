CREATE OR ALTER PROCEDURE [dbo].[contract_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @ContractStatus varchar(8),
    @SearchWith VARCHAR(64) = NULL,
    @Filters VARCHAR(1024) = NULL,
    @UserInfoId INT
AS 
BEGIN
    DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;
    DECLARE @ContractStatusId INT;

    SELECT @ContractStatusId = Id FROM MasterEntityData WHERE Code = @ContractStatus

    SELECT
        @UserCategory = UserCategory.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        UserInfo.Id = @UserInfoId;

    DECLARE @StartDate varchar(64)
    DECLARE @EndDate varchar(64)
    DECLARE @SearchText varchar(64)

    SET NOCOUNT ON;

    SELECT 
        @StartDate = JSON_VALUE(@Filters, '$.StartDate'),
        @EndDate = JSON_VALUE(@Filters, '$.EndDate'),
        @SearchText= JSON_VALUE(@Filters, '$.SearchText')

    IF @Page < 1
        SET @Page = 1;

    DECLARE @SQL NVARCHAR(MAX);

    SET @Filters = @Filters;

    SELECT
        Contract.Id,
        Contract.ContractNumber,
        CustomerInfo.Name AS CustomerName,
        Contract.StartDate,
        Contract.EndDate,
        Contract.ContractValue,
        Contract.CreatedBy,
        ContractStatus.Name AS ContractStatus
    FROM
        Contract
        LEFT JOIN CustomerInfo ON Contract.CustomerInfoId = CustomerInfo.Id
        LEFT JOIN MasterEntityData AS ContractStatus ON Contract.ContractStatusId = ContractStatus.Id
        LEFT JOIN TenantOffice ON TenantOffice.Id = Contract.TenantOfficeId
        LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    WHERE
        (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = Contract.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        )
        AND
        Contract.ContractStatusId = @ContractStatusId
        AND
        (
            @SearchWith IS NULL
            OR (@SearchWith = 'CustomerName' AND CustomerInfo.Name LIKE '%' + @SearchText + '%')
            OR (@SearchWith = 'ContractNumber' AND Contract.ContractNumber LIKE '%' + @SearchText + '%')
            OR (@SearchWith = 'ContractExpiredBetween' AND EndDate BETWEEN @StartDate AND @EndDate)
            OR (@SearchWith = 'ContractBookedBetween' AND StartDate BETWEEN @StartDate AND @EndDate)
        )
    ORDER BY
        Contract.Id DESC
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
