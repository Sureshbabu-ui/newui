CREATE OR ALTER   PROCEDURE [dbo].[purchaseorder_create]
     @DemandId INT,
     @PartId INT,
     @PartIndentRequestId INT,
	 @TenantOfficeId INT,
     @VendorId INT,
	 @VendorBranchId INT,
	 @CgstRate DECIMAL(8,2),
	 @SgstRate DECIMAL(8,2),
	 @IgstRate DECIMAL(8,2),
	 @ShipToTenantOfficeInfoId INT = NULL,
     @BillToTenantOfficeInfoId INT,
	 @ShipToCustomerSiteId INT = NULL,
     @Description VARCHAR(128),
	 @StockTypeId INT,
	 @Price DECIMAL(8,2),
	 @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
	SET XACT_ABORT ON; 

	BEGIN TRANSACTION
	DECLARE @PartName VARCHAR(8),@Quantity INT,@Unit INT;
	DECLARE @CurrentDate DATETIME = GETUTCDATE();
    DECLARE @Year INT = YEAR(@CurrentDate);
    DECLARE @Month INT = MONTH(@CurrentDate);
    DECLARE @AppValue VARCHAR(1024);
	DECLARE @PoStatusId INT;
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
    SET @Year = @Year % 100
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	DECLARE @PONumber VARCHAR(18)
	EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_PO', 
			@Year = @Year,
			@TenantOfficeId = @TenantOfficeId,
			@DocumentNumber = @PONumber OUTPUT

	SELECT @PoStatusId = Id FROM MasterEntityData WHERE Code = 'POS_RLSD'

	SELECT 
		@Quantity = PID.Quantity,
		@Unit = PID.UnitOfMeasurementId,
		@PartName = P.PartName
	FROM PartIndentDemand PID
		LEFT JOIN Part P ON P.Id = PID.PartId
	WHERE PID.Id = @DemandId

    INSERT INTO PurchaseOrder( 
		PoNumber,
		PoDate,
		VendorId,
		VendorBranchId,
		TenantOfficeId,
		PoStatusId,
	    ShipToTenantOfficeInfoId,
		BillToTenantOfficeInfoId,
		ShipToCustomerSiteId,
		[Description],
		CreatedBy,
		CreatedOn
    )
    VALUES (
        @PONumber,
		GETUTCDATE(),
        @VendorId,
		@VendorBranchId,
		@TenantOfficeId,
		@PoStatusId , -- TODO: POStatus Need to be changed
	    @ShipToTenantOfficeInfoId,
		@BillToTenantOfficeInfoId,
		@ShipToCustomerSiteId,
		@Description,
		@CreatedBy,
		GETUTCDATE()
    );

	DECLARE @PurchaseOrderId INT; 
	SET @PurchaseOrderId = SCOPE_IDENTITY();

	INSERT INTO PurchaseOrderDetail( 
		PurchaseOrderId,
		PartId,
		PartIndentRequestId,
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
    VALUES (
		@PurchaseOrderId,
		@PartId,
		@PartIndentRequestId,
		@PartName,
		@StockTypeId,
		0,
		0,
		@Quantity,
		@Unit,
		@Price,
		@CgstRate,
		@SgstRate,
		@IgstRate,
		@Description,
		@CreatedBy,
		GETUTCDATE()
    );

	-- Update Part Indent Demand
	UPDATE PartIndentDemand
	SET 
		IsCwhAttentionNeeded = 0,
		IsCwhProcessed = 1,
		UpdatedOn= GETUTCDATE(),
		UpdatedBy=@CreatedBy
	WHERE 
		Id=@DemandId AND
		IsCwhAttentionNeeded = 1 AND
		IsCwhProcessed = 0

	COMMIT TRANSACTION
END
