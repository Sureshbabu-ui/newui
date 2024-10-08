CREATE OR ALTER PROCEDURE [dbo].[contractmanpower_summary_list]
    @ContractId INT,
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        CMS.Id,
        CS.SiteName AS CustomerSite,
        TOF.OfficeName AS TenantOffice,
        ET.[Name] AS EngineerType,
        EL.[Name] AS EngineerLevel,
        CMS.EngineerMonthlyCost,
        CMS.EngineerCount,
        CMS.DurationInMonth,
        CMS.CustomerAgreedAmount,
        CMS.BudgetedAmount,
        CMS.MarginAmount,
        CMS.Remarks
    FROM ContractManPower CMS
    LEFT JOIN MasterEntityData ET ON ET.Id = CMS.EngineerTypeId 
    LEFT JOIN MasterEntityData EL ON EL.Id = CMS.EngineerLevelId
    LEFT JOIN CustomerSite CS ON CS.Id = CMS.CustomerSiteId
    LEFT JOIN CustomerInfo CI ON CMS.CustomerSiteId = CI.CustomerId 
    LEFT JOIN TenantOfficeInfo TOI ON CMS.TenantOfficeInfoId = TOI.TenantOfficeId
    LEFT JOIN TenantOffice TOF ON TOF.Id = CMS.TenantOfficeInfoId
    WHERE
        CMS.ContractId = @ContractId AND
        (@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%' OR 
		TOF.OfficeName LIKE '%' + @Search + '%')
    ORDER BY
        CMS.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
