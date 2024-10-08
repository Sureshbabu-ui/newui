CREATE OR ALTER PROCEDURE [dbo].[purchaseorder_count]
	@UserInfoId INT,
	@Search VARCHAR(64) = NULL,
	@TotalRows INT OUTPUT
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
		UserInfo.Id = @UserInfoId

    SELECT 
        @TotalRows=COUNT(PO.Id) 
	FROM
        PurchaseOrder PO
		LEFT JOIN TenantOffice T ON T.Id = PO.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
	WHERE
		(
		@UserCategory = 'UCT_FRHO'
		OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id)
		OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
		)
		AND 
		(ISNULL(@Search, '') = '' OR PO.PoNumber LIKE '%' + @Search + '%')
END