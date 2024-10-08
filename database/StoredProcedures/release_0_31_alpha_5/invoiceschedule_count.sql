CREATE OR ALTER PROCEDURE [dbo].[invoiceschedule_count]
    @UserInfoId INT,
    @SearchWith VARCHAR(64) = NULL,
    @Filters VARCHAR(1024) = NULL,
    @Page INT = 1,
    @PerPage INT = 10,
	@TotalRows INT OUTPUT

AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    DECLARE @StartDate varchar(64)
    DECLARE @EndDate varchar(64)
    DECLARE @SearchText varchar(64)

    SELECT 
        @StartDate = JSON_VALUE(@Filters, '$.StartDate'),
        @EndDate = JSON_VALUE(@Filters, '$.EndDate'),
        @SearchText= JSON_VALUE(@Filters, '$.SearchText')

    DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;
	SELECT
        @UserCategory = UserCategory.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        UserInfo.Id = @UserInfoId;

    SELECT 
        @TotalRows = COUNT(CIS.Id)
    FROM ContractInvoiceSchedule CIS
    LEFT JOIN ContractInvoice CI ON CI.ContractInvoiceScheduleId=CIS.Id
	LEFT JOIN Invoice ON Invoice.Id=CI.InvoiceId
	INNER JOIN [Contract] C ON C.Id=CIS.ContractId
	INNER JOIN CustomerInfo CUI ON CUI.Id=C.CustomerInfoId
    INNER JOIN TenantOffice T ON T.Id = C.TenantOfficeId
    INNER JOIN TenantRegion TR ON TR.Id = T.RegionId
	WHERE
        (
            @UserCategory = 'UCT_FRHO' OR
            (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = C.TenantOfficeId) OR
            (@UserCategory = 'UCT_FRRO' AND TR.Id = @UserRegionId)
        )
        AND
		 DATEADD(DAY, CONVERT(INT,(SELECT AppValue FROM AppSetting wHERE AppKey='InvoicePreApprovalDays')), CIS.ScheduledInvoiceDate)< GETUTCDATE()
		AND
        (
            @SearchWith IS NULL OR
            (@SearchWith = 'CustomerName' AND CUI.[Name] LIKE '%' + @SearchText + '%') OR
            (@SearchWith = 'ContractNumber' AND C.ContractNumber LIKE '%' + @SearchText + '%') OR
			(@SearchWith = 'InvoiceNumber' AND Invoice.InvoiceNumber LIKE '%' + @SearchText + '%') OR
            (@SearchWith = 'DateBetween' AND CIS.ScheduledInvoiceDate BETWEEN @StartDate AND @EndDate)
        )
END 

