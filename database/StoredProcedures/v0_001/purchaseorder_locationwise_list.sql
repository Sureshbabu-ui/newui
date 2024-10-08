CREATE OR ALTER PROCEDURE [dbo].[purchaseorder_locationwise_list]
	@Page INT = 1,
	@PerPage INT = 10,
	@Search varchar(50) = NULL,
	@UserInfoId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @TenantOfficeId INT;
	DECLARE @PoStatusId INT;
	SELECT @TenantOfficeId  = TenantOfficeId FROM UserInfo WHERE UserInfo.Id = @UserInfoId;
	SELECT @PoStatusId  = Id FROM MasterEntityData WHERE Code = 'POS_RLSD';

	IF @Page < 1
	SET @Page = 1;
    SELECT 
        PO.Id,
		PO.PoNumber,
		PO.VendorId,
		PO.PoDate,
		VI.[Name] AS Vendor,
		T.OfficeName AS TenantOffice
	FROM
        PurchaseOrder PO
		LEFT JOIN VendorInfo VI ON VI.VendorId = PO.VendorId AND IsActive = 1 AND EffectiveTo IS NULL
		LEFT JOIN TenantOffice T ON T.Id = PO.TenantOfficeId
	WHERE
		(ISNULL(@Search, '') = '' AND PO.PoStatusId = @PoStatusId OR 
		PO.PoNumber LIKE '%' + @Search + '%') AND
        PO.TenantOfficeId = @TenantOfficeId
    ORDER BY PO.PoDate DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END