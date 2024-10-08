CREATE OR ALTER   PROCEDURE [dbo].[tenant_edit_details]
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
		TI.Id,
        TI.[Name],
        TI.NameOnPrint,
		TI.PanNumber,
		TI.CountryId AS Country,
		TI.StateId AS [State],
		TI.CityId AS City,
		TI.Pincode,
		TI.Address,
		TOICWH.Id AS CWHId,
		TOIGRC.Id AS GRCId,
		TOIHDOF.Id AS HDOFId,
	    TOICWH.[Address] AS CWHAddress,
		TOIGRC.[Address] AS GRCAddress,
		TOIHDOF.[Address] AS HOAddress
	FROM TenantInfo TI
		LEFT JOIN TenantOffice TCWH ON TCWH.TenantId=@TenantId AND TCWH.OfficeTypeId = @CWHOfficeTypeId
		LEFT JOIN TenantOfficeInfo TOICWH ON TOICWH.TenantOfficeId = TCWH.Id
		LEFT JOIN TenantOffice TGRC ON TGRC.TenantId=@TenantId AND TGRC.OfficeTypeId = @GRCOfficeTypeId
		LEFT JOIN TenantOfficeInfo TOIGRC ON TOIGRC.TenantOfficeId = TGRC.Id
		LEFT JOIN TenantOffice THDOF ON THDOF.TenantId=@TenantId AND THDOF.OfficeTypeId = @HeadOfficeTypeId
		LEFT JOIN TenantOfficeInfo TOIHDOF ON TOIHDOF.TenantOfficeId = THDOF.Id
	WHERE
		TI.TenantId = @TenantId	AND TI.EffectiveTo Is NULL AND TOICWH.EffectiveTo IS NULL AND TOIGRC.EffectiveTo IS NULL AND TOIHDOF.EffectiveTo IS NULL
END