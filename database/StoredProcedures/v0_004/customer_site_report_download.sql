CREATE OR ALTER PROCEDURE [dbo].[customer_site_report_download]
	@TimeZone VARCHAR(64),
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@CustomerId INT = NULL,
	@ContractId INT = NULL,
	@UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;

	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = UserInfo.TenantOfficeId,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	SELECT 
		C.ContractNumber,
		CS.SiteName,
		CS.[Address],
		S.[Name] AS SiteState,
		City.[Name] AS SiteCity,
		CS.Pincode,
		CS.PrimaryContactPhone AS Telephone,
		CS.PrimaryContactName,
		CS.PrimaryContactEmail,
		CS.SecondaryContactName,
		CS.SecondaryContactEmail,
		T.OfficeName AS MappedLocation,
		(CASE WHEN CCS.IsReRequired = 1 THEN 'YES' ELSE 'NO' END) AS RE  
    FROM CustomerSite CS
		LEFT JOIN ContractCustomerSite CCS ON CCS.CustomerSiteId = CS.Id
		LEFT JOIN [Contract] C ON C.Id = CCS.ContractId
		LEFT JOIN Customer CR ON CR.Id = C.CustomerId
		LEFT JOIN CustomerInfo CI ON CI.CustomerId = CR.Id AND CI.EffectiveTo IS NULL
		LEFT JOIN [State] S ON S.Id = CS.StateId
		LEFT JOIN City ON City.Id = CS.CityId
		LEFT JOIN TenantOffice T ON T.Id = CS.TenantOfficeId
	WHERE (@ContractId IS NULL OR CCS.ContractId = @ContractId)
		  AND (@CustomerId IS NULL OR C.CustomerInfoId = @CustomerId)
          AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
          AND (@TenantOfficeId IS NULL OR CS.TenantOfficeId = @TenantOfficeId) 
		  AND (
				@UserCategory = 'UCT_FRHO'
				OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
				OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		      )
	ORDER BY CS.CreatedOn DESC
END