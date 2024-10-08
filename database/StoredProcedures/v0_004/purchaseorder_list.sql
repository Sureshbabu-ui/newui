CREATE OR ALTER PROCEDURE [dbo].[purchaseorder_list]
    @Page INT = 1,
    @PerPage INT = 10,
    @Search varchar(50) = NULL,
    @UserInfoId INT
AS
BEGIN 
    SET NOCOUNT ON;
    
    DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;

    -- Retrieve user information
    SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserInfoId

    IF @Page < 1
        SET @Page = 1;

    SELECT 
        PO.Id,
        PO.PoNumber,
        PO.PoDate,
        VI.[Name] AS Vendor,
        T.OfficeName AS TenantOffice,
        MED.[Name] AS PoStatus
    FROM
        PurchaseOrder PO
        LEFT JOIN VendorInfo VI ON VI.VendorId = PO.VendorId AND VI.EffectiveTo IS NULL
        LEFT JOIN TenantOffice T ON T.Id = PO.TenantOfficeId
        LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
        LEFT JOIN MasterEntityData MED ON MED.Id = PO.PoStatusId
    WHERE
        (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = T.Id)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        )
        AND ( ISNULL(@Search, '') = '' OR PO.PoNumber LIKE '%' + @Search + '%' )
    ORDER BY PO.PoDate DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END