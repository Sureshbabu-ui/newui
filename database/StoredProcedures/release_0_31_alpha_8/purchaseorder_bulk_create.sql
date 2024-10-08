CREATE OR ALTER PROCEDURE [dbo].[purchaseorder_bulk_create]
     @VendorId INT,
	 @VendorBranchId INT,
	 @PartList NVARCHAR(max),
	 @ShipToTenantOfficeInfoId INT,
     @BillToTenantOfficeInfoId INT,
     @Description VARCHAR(128),
	 @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	DECLARE @UserOfficeId INT;
	DECLARE @Unit INT; 
	DECLARE @CurrentDate DATETIME = GETUTCDATE();
    DECLARE @Year INT = YEAR(@CurrentDate);
    DECLARE @Month INT = MONTH(@CurrentDate);
    DECLARE @AppValue VARCHAR(1024);
	DECLARE @PoPartTypeId INT;
	DECLARE @PoStatusId INT;
	DECLARE @FyStartMonth INT;

	SELECT @UserOfficeId = TenantOfficeId FROM UserInfo WHERE UserInfo.Id = @CreatedBy;
	SELECT @Unit = Id FROM MasterEntityData WHERE Code =  'UOM_NUMS'
	SELECT @PoStatusId = Id FROM MasterEntityData WHERE Code = 'POS_RLSD'
	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';


	BEGIN TRANSACTION

	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
    SET @Year = @Year % 100

	UPDATE AppSetting
	SET @AppValue = AppValue = AppValue + 1
	WHERE AppKey = 'LastPOId';

    INSERT INTO PurchaseOrder( 
		PoNumber,
		PoDate,
		VendorId,
		VendorBranchId,
		TenantOfficeId,
		PoStatusId,
	    ShipToTenantOfficeInfoId,
		BillToTenantOfficeInfoId,
		[Description],
		CreatedBy,
		CreatedOn
    )
    VALUES (
        'PO/' + (SELECT Code FROM TenantOffice WHERE Id = @UserOfficeId) + '/' + CAST(@Year AS VARCHAR(2)) + '/' + RIGHT('000000' + CAST((@AppValue) AS VARCHAR(6)), 6),
		GETUTCDATE(),
        @VendorId,
		@VendorBranchId,
		@UserOfficeId,
		@PoStatusId , -- TODO: POStatus Need to be changed
	    @ShipToTenantOfficeInfoId,
		@BillToTenantOfficeInfoId,
		@Description,
		@CreatedBy,
		GETUTCDATE()
    );

	DECLARE @PurchaseOrderId INT; 
	SET @PurchaseOrderId = SCOPE_IDENTITY();

	INSERT INTO PurchaseOrderDetail( 
		PurchaseOrderId,
		PartId,
		PartName,
		PoPartTypeId,
		IsExchangable,
		WarrantyPeriodInDays,
		Quantity,
		Unit,
		Price,
		CgstRate,
		SgstRate,
		IgstRate,
		[Description],
		CreatedBy,
		CreatedOn
    )
   SELECT
		@PurchaseOrderId,
		JSON.Id,
		JSON.[Description],
		JSON.StockTypeId,
		0,
		0,
		JSON.Quantity,
		@Unit,
		JSON.Price,
		JSON.Cgst,
		JSON.Sgst,
		JSON.Igst,
		@Description,
		@CreatedBy,
		GETUTCDATE()
	FROM OPENJSON(@PartList)
	WITH(
		Id INT,
		PartName VARCHAR(128),
		StockTypeId INT,
		Price DECIMAL(16,2),
		Quantity DECIMAL(8,2),
		Cgst DECIMAL(8,2),
		Sgst DECIMAL(8,2),
		Igst DECIMAL(8,2),
		[Description] VARCHAR(128)
		)  AS JSON
	COMMIT TRANSACTION
END