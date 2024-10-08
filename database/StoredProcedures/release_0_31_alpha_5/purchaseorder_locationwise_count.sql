CREATE OR ALTER PROCEDURE [dbo].[purchaseorder_locationwise_count] 
	@Search VARCHAR(50) = NULL,
	@UserInfoId INT,
	@TotalRows VARCHAR(10) OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SET NOCOUNT ON;
	DECLARE @TenantOfficeId INT;
	DECLARE @PoStatusId INT;
	SELECT @TenantOfficeId  = TenantOfficeId FROM UserInfo WHERE UserInfo.Id = @UserInfoId;
	SELECT @PoStatusId  = Id FROM MasterEntityData WHERE Code = 'POS_RLSD';

	SELECT 
		@TotalRows = COUNT(PO.Id)
	FROM PurchaseOrder PO
	WHERE
		(ISNULL(@Search, '') = '' AND PO.PoStatusId = @PoStatusId OR 
		PO.PoNumber LIKE '%' + @Search + '%') AND
        PO.TenantOfficeId = @TenantOfficeId
END
