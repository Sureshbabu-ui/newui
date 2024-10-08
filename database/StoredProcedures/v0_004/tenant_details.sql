CREATE OR ALTER PROCEDURE [dbo].[tenant_details]
	@TenantId	INT
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @CWHOfficeTypeId INT ;
	DECLARE @GRCOfficeTypeId INT;
	DECLARE @HeadOfficeTypeId INT;

	SELECT	@CWHOfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_CWHS'
	SELECT	@GRCOfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_GRCR'
	SELECT	@HeadOfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_HDOF'
	
	SELECT 
		T.TenantCode,
        TI.[Name],
        TI.NameOnPrint,
		TI.CreatedOn,
		TI.PanNumber,
		Country.[Name] AS Country,
		[State].[Name] AS TenantState,
		City.[Name] AS City,
		TI.Pincode,
		TI.[Address],
		CU.FullName AS CreatedBy,
		TI.EffectiveFrom,
		TI.EffectiveTo,
	    TOICWH.[Address] AS CWHAddress,
		TOIGRC.[Address] AS GRCAddress,
		TOIHDOF.[Address] AS HOAddress
	FROM TenantInfo TI
		LEFT JOIN UserInfo CU ON CU.Id=TI.CreatedBy
		JOIN Tenant T ON TI.TenantId = T.Id
		LEFT JOIN Country ON Country.Id = TI.CountryId
		LEFT JOIN [State] ON [State].Id = TI.StateId
		LEFT JOIN City ON City.Id = TI.CityId
		LEFT JOIN TenantOffice TCWH ON TCWH.TenantId=@TenantId AND TCWH.OfficeTypeId = @CWHOfficeTypeId
		LEFT JOIN TenantOfficeInfo TOICWH ON TOICWH.TenantOfficeId = TCWH.Id
		LEFT JOIN TenantOffice TGRC ON TGRC.TenantId=@TenantId AND TGRC.OfficeTypeId = @GRCOfficeTypeId
		LEFT JOIN TenantOfficeInfo TOIGRC ON TOIGRC.TenantOfficeId = TGRC.Id
		LEFT JOIN TenantOffice THDOF ON THDOF.TenantId=@TenantId AND THDOF.OfficeTypeId = @HeadOfficeTypeId
		LEFT JOIN TenantOfficeInfo TOIHDOF ON TOIHDOF.TenantOfficeId = THDOF.Id
	WHERE
		TI.TenantId = @TenantId	AND TI.EffectiveTo Is NULL AND TOICWH.EffectiveTo IS NULL AND TOIGRC.EffectiveTo IS NULL AND TOIHDOF.EffectiveTo IS NULL
END