CREATE OR ALTER     PROCEDURE [dbo].[customer_site_bulk_upload]
     @CreatedBy INT,
     @ContractId INT,
     @CustomerSites NVARCHAR(MAX)
AS
BEGIN 
        SET NOCOUNT ON;
        SET XACT_ABORT ON; 
        BEGIN TRAN
		DECLARE  @TempSiteNameID TABLE (SiteId INT,SiteName VARCHAR(64),IsReRequiredId BIT);

		INSERT INTO 
			@TempSiteNameID (SiteId,SiteName,IsReRequiredId)
		SELECT 
			JSON_VALUE(value, '$.SiteNameId'),
			NULL,
			JSON_VALUE(value, '$.IsReRequiredId')
		FROM 
			OPENJSON(@CustomerSites)
		WHERE 
			JSON_VALUE(value, '$.SiteNameId') IS NOT NULL
			
        INSERT INTO CustomerSite (SiteName,CustomerId,[Address], CityId, StateId, Pincode,PrimaryContactPhone, TenantOfficeId,PrimaryContactName,SecondaryContactName,PrimaryContactEmail,SecondaryContactEmail,CreatedBy,CreatedOn)
		OUTPUT  inserted.Id,Inserted.SiteName,0 INTO @TempSiteNameID
		SELECT SiteName,CustomerId, ([Address] + 
		CONCAT(
			NULLIF(' / ' + AddressOne, ' / '), 
			NULLIF(' / ' + AddressTwo, ' / '), 
			NULLIF(' / ' + AddressThree, ' / ')
		)),
		CityId, StateId, Pincode,Telephone,LocationId,ContactPersonOne,ContactPersonTwo,EmailOne,EmailTwo,@CreatedBy,GETUTCDATE()
        FROM OPENJSON(@CustomerSites)
        WITH
        (SiteName VARCHAR(64),
        SiteNameId INT,
        CustomerId INT,
        Address VARCHAR(128),
        AddressOne VARCHAR(128),
        AddressTwo VARCHAR(128),
        AddressThree VARCHAR(128),
        CityId INT,
        StateId INT,
        Pincode VARCHAR(6),
		Telephone VARCHAR(16),
		LocationId INT,
        ContactPersonOne VARCHAR(64),
        ContactPersonTwo VARCHAR(64),
        EmailOne VARCHAR(64),
        EmailTwo VARCHAR(64),
		IsReRequiredId BIT)
		WHERE SiteNameId IS NULL
	
		UPDATE TSN
		SET TSN.IsReRequiredId = CS.IsReRequiredId
		FROM @TempSiteNameID TSN
		INNER JOIN (
			SELECT SiteName, IsReRequiredId
			FROM OPENJSON(@CustomerSites)
			WITH (
				SiteName VARCHAR(64),
				IsReRequiredId BIT
			)		
		) AS CS ON TSN.SiteName = CS.SiteName;


		INSERT INTO 
				ContractCustomerSite (ContractId, CustomerSiteId, IsReRequired, CreatedBy, CreatedOn)
		SELECT 
				@ContractId,
				SiteId,
				IsReRequiredId,
				@CreatedBy,
				GETUTCDATE()
		FROM @TempSiteNameID;

COMMIT TRAN
END 
