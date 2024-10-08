CREATE OR ALTER PROCEDURE [dbo].[tenant_office_getnames_for_cwh]
	 @UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;
 
	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	SELECT 
		T.Id,
		T.OfficeName,
		TOI.[Address],
		S.GstStateCode
	FROM TenantOffice T
		LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
		LEFT JOIN MasterEntityData OfficeType ON OfficeType.Id = T.OfficeTypeId
		LEFT JOIN [State] S ON S.Id = TOI.StateId
	WHERE (TOI.EffectiveTo IS NULL) AND 
	TOI.IsVerified = 1 AND 
	(
        @UserCategory = 'UCT_FRHO'
        OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id)
        OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
    ) AND
	OfficeType.Code IN ('TOT_AROF','TOT_CWHS')
END 
