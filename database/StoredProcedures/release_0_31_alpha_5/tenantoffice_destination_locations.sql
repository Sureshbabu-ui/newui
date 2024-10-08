CREATE OR ALTER PROCEDURE [dbo].[tenantoffice_destination_locations]
	 @UserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserOfficeId INT;
	DECLARE @OfficeTypeId INT;

	SELECT	@OfficeTypeId = Id FROM MasterEntityData WHERE Code ='TOT_AROF'

	SELECT 
		@UserOfficeId = TenantOfficeId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;
	SELECT 
		T.Id,
		T.OfficeName,
		TOI.[Address]
	FROM TenantOffice T
		LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
	WHERE (TOI.EffectiveTo IS NULL) AND 
		TOI.IsVerified = 1 AND 
		T.OfficeTypeId=@OfficeTypeId AND
		T.Id != @UserOfficeId
END 
