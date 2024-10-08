CREATE  PROCEDURE [dbo].[filtered_user_category_tenant_office_list]
	 @UserId INT,
	 @UserCategoryCode VARCHAR(64)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @OfficeTypeId INT;
	DECLARE @AreaOfficeTypeId INT;
	DECLARE @RegionalOfficeTypeId INT;
	DECLARE @HeadOfficeTypeId INT;

	SELECT	@AreaOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_AROF'
	SELECT	@RegionalOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_RGOF'
	SELECT	@HeadOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_HDOF'

	SELECT 
		T.Id,
		T.OfficeName,
		TOI.Address
		
	FROM TenantOffice T
		LEFT JOIN TenantOfficeInfo TOI ON T.Id = TOI.TenantOfficeId
	
	WHERE (TOI.EffectiveTo IS NULL) AND 
	TOI.IsVerified = 1 AND 
	(
        @UserCategoryCode = 'UCT_FRHO 'AND T.OfficeTypeId=@HeadOfficeTypeId
        OR (@UserCategoryCode = 'UCT_CPTV' AND T.OfficeTypeId=@AreaOfficeTypeId)
        OR (@UserCategoryCode = 'UCT_FRRO' AND  T.OfficeTypeId=@RegionalOfficeTypeId)
    )
END 