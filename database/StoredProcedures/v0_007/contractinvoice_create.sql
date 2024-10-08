CREATE OR ALTER PROCEDURE [dbo].[contractinvoice_create]
	@ContractId INT,
	@ContractInvoiceScheduleId INT,
	@Description VARCHAR(128),
	@InvoiceAmount DECIMAL(16,2),
	@DeductionAmount DECIMAL(16,2)=0,
	@DeductionDescription VARCHAR(128),
	@Sgst DECIMAL(16,2),
	@Cgst DECIMAL(16,2),
	@Igst DECIMAL(16,2),
	@CollectionDueDate DATE,
	@InvoiceStatus INT,
	@CreatedBy INT,
	@ContractInvoiceDetail NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
    SET XACT_ABORT ON;
	DECLARE @InvoiceId INT; 
	
BEGIN TRANSACTION

DECLARE @LastInvoiceNumber VARCHAR(1024);
SET @ContractId= (SELECT ContractId FROM ContractInvoiceSchedule WHERE Id=@ContractInvoiceScheduleId)
UPDATE Contract
SET CallStopDate = COALESCE(CallStopDate, @CollectionDueDate)
WHERE Id = @ContractId;

DECLARE @TenantOfficeId INT=(SELECT Contract.TenantOfficeId FROM Contract
        WHERE Contract.Id=@ContractId
          );

DECLARE @TenantOfficeInfoId INT=(SELECT TenantOfficeInfo.Id FROM TenantOfficeInfo
INNER JOIN TenantOffice ON TenantOfficeInfo.TenantOfficeId=TenantOffice.Id AND TenantOffice.Id=@TenantOfficeId
WHERE TenantOfficeInfo.EffectiveTo IS NULL
);

DECLARE @CustomerInfoId int=(SELECT TOP 1 CustomerInfo.Id FROM CustomerInfo 
        INNER JOIN Contract ON Contract.CustomerId= CustomerInfo.CustomerId
		WHERE Contract.Id=@ContractId AND
		CustomerInfo.EffectiveTo IS NULL);

	DECLARE @CurrentDate DATETIME = GETUTCDATE();
    DECLARE @Year INT = YEAR(@CurrentDate);
    DECLARE @Month INT = MONTH(@CurrentDate);
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';
	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
    SET @Year = @Year % 100
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)
	   
    DECLARE @DocumentNumber VARCHAR(32);
    DECLARE @InvoiceNumber VARCHAR(32)  ;
    EXEC [dbo].[documentnumberformat_get_nextnumber]
        @DocumentTypeCode = 'DCT_CINV',
        @Year = @Year,
		@TenantOfficeId = @TenantOfficeId,
        @DocumentNumber = @DocumentNumber OUTPUT;
	SET @InvoiceNumber = @DocumentNumber

	INSERT INTO Invoice(
	InvoiceNumber,
	InvoiceTypeId,
	InvoiceDate,
	Description,
	InvoiceAmount,
	DeductionAmount,
	DeductionDescription,
	Sgst,
	Cgst,
	Igst,
	CollectionDueDate,
	InvoiceStatus,
	CustomerInfoId,
	CreatedBy,
	CreatedOn
	)
	VALUES(
	@InvoiceNumber,
	1,
	GETUTCDATE(),
	@Description,
	@InvoiceAmount,
	@DeductionAmount,
	@DeductionDescription,
	@Sgst,
	@Cgst,
	@Igst,
    @CollectionDueDate,
	@InvoiceStatus,
	@CustomerInfoId,
	@CreatedBy,
	SYSUTCDATETIME()
	)
	SET @InvoiceId = SCOPE_IDENTITY();

	INSERT INTO ContractInvoice(
	ContractId,
	ContractInvoiceScheduleId,
	InvoiceId
	)
	VALUES(@ContractId,
	@ContractInvoiceScheduleId,
    @InvoiceId	
	)
	SET @InvoiceId = SCOPE_IDENTITY();

	INSERT INTO ContractInvoiceDetail(
	ContractInvoiceId,
	ItemDescription,
	ServicingAccountingCode,
	Quantity,
	Unit,
	Rate,
	Amount,
	Discount,
	Sgst,
	Cgst,
	Igst,
	NetAmount,
	CreatedBy,
	CreatedOn
	)
	SELECT
	@InvoiceId,
	ItemDescription,
	ServicingAccountingCode,
	Quantity,
	Unit,
	Rate,
	Amount,
	ISNULL(Discount, 0),
	Sgst,
	Cgst,
	Igst, 
	((Quantity*Rate-ISNULL(Discount, 0))+ (Quantity*Rate-ISNULL(Discount, 0))*Sgst/100 + (Quantity*Rate-ISNULL(Discount, 0))*Cgst/100 +(Quantity*Rate-ISNULL(Discount, 0))*Igst/100),
	@CreatedBy,
	SYSUTCDATETIME()
    FROM OPENJSON(@ContractInvoiceDetail)
	WITH(
	ItemDescription VARCHAR(128),
	ServicingAccountingCode VARCHAR(8),
	Quantity DECIMAL(16,2),
	Unit DECIMAL(16,2),
	Rate DECIMAL(16,2),
	Amount DECIMAL(16,2),
	Discount DECIMAL(16,2),
	Sgst DECIMAL(16,2),
	Cgst DECIMAL(16,2),
	Igst DECIMAL(16,2),
	NetAmount DECIMAL(16,2)
	)

	INSERT INTO InvoiceReconciliation(
	InvoiceId,
	NetInvoiceAmount,
	OutStandingAmount,
	StatusDate,
	PrimaryAccountableId,
	SecondaryAccountableId,
	CreatedBy,
	CreatedOn
	)
	values(
	@InvoiceId,
	@InvoiceAmount-@DeductionAmount+@Sgst+@Cgst+@Igst,
	@InvoiceAmount-@DeductionAmount+@Sgst+@Cgst+@Igst,
	GETUTCDATE(),
	(SELECT SalesContactPersonId FROM Contract WHERE Id=@ContractId),
	(SELECT SalesContactPersonId FROM Contract WHERE Id=@ContractId),
	@CreatedBy,
	GETUTCDATE()
); 

DECLARE @HeaderUniqueID VARCHAR(256)=(SELECT NEWID());

DECLARE @InsertedEInvoiceHeader TABLE (
    Business varchar(16),
    Invoiceno varchar(32),
    InvoiceDate Date,
    [Type] varchar(16),
    SubType varchar(16),
    Cancel int,
    [Location] varchar(16),
    LocationState varchar(64),
    LocationStateCode varchar(2),
    LocationGSTIN varchar(16),
    CustomerName varchar(64),
    CustomerAddress1 varchar(128),
    CustomerCity varchar(32),
    CustomerState varchar(64),
    CustomerStateCode int,
    CustomerPincode varchar(8),
    CustomerGSTIN varchar(16),
    CustomerShipName varchar(64),
    CustomerShipAddress1 varchar(128),
    CustomerShipCity varchar(64),
    CustomerShipState varchar(64),
    CustomerShipStateCode int,
    CustomerShipPincode varchar(8),
    CustShipGSTIN varchar(16),
    TaxableValue decimal(16, 2),
    CGSTAmount decimal(16, 2),
    SGSTAmount decimal(16, 2),
    IGSTAmount decimal(16, 2),
    NETAmount decimal(16, 2),
    UniqueID varchar(256),
    BILLTOCODE varchar(32),
    SHIPTOCODE varchar(32),
    RAISEDFROM varchar(16),
    CreatedBy int,
    CreatedOn datetime
);

INSERT INTO SalesRegisterHeader (
    Business,
    Invoiceno,
    InvoiceDate,
    [Type],
    SubType,
    Cancel,
    [Location],
    LocationState,
    LocationStateCode,
    LocationGSTIN,
    CustomerName,
    CustomerAddress1,
    CustomerCity,
    CustomerState,
    CustomerStateCode,
    CustomerPincode,
    CustomerGSTIN,
    CustomerShipName,
    CustomerShipAddress1,
    CustomerShipCity,
    CustomerShipState,
    CustomerShipStateCode,
    CustomerShipPincode,
    CustShipGSTIN,
    TaxableValue,
    CGSTAmount,
    SGSTAmount,
    IGSTAmount,
    NETAmount,
    UniqueID,
    BILLTOCODE,
    SHIPTOCODE,
    RAISEDFROM,
	EISent,
    CreatedBy,
    CreatedOn
)
OUTPUT
    INSERTED.Business,
    INSERTED.Invoiceno,
    INSERTED.InvoiceDate,
    INSERTED.[Type],
    INSERTED.SubType,
    INSERTED.Cancel,
    INSERTED.[Location],
    INSERTED.LocationState,
    INSERTED.LocationStateCode,
    INSERTED.LocationGSTIN,
    INSERTED.CustomerName,
    INSERTED.CustomerAddress1,
    INSERTED.CustomerCity,
    INSERTED.CustomerState,
    INSERTED.CustomerStateCode,
    INSERTED.CustomerPincode,
    INSERTED.CustomerGSTIN,
    INSERTED.CustomerShipName,
    INSERTED.CustomerShipAddress1,
    INSERTED.CustomerShipCity,
    INSERTED.CustomerShipState,
    INSERTED.CustomerShipStateCode,
    INSERTED.CustomerShipPincode,
    INSERTED.CustShipGSTIN,
    INSERTED.TaxableValue,
    INSERTED.CGSTAmount,
    INSERTED.SGSTAmount,
    INSERTED.IGSTAmount,
    INSERTED.NETAmount,
    INSERTED.UniqueID,
    INSERTED.BILLTOCODE,
    INSERTED.SHIPTOCODE,
    INSERTED.RAISEDFROM,
    INSERTED.CreatedBy,
    INSERTED.CreatedOn
INTO @InsertedEInvoiceHeader
	values(
	    'BS-IMS',
		@InvoiceNumber,
		GETUTCDATE(),
		'INV',
		'B2B',
		0,
		(SELECT TOP 1 TenantOffice.Code FROM TenantOfficeInfo LEFT JOIN TenantOffice ON TenantOffice.Id=TenantOfficeInfo.TenantOfficeId WHERE TenantOfficeInfo.Id=@TenantOfficeInfoId),
		(SELECT  TOP 1 State.GstStateName FROM [State] LEFT JOIN TenantOfficeInfo ON TenantOfficeInfo.GstStateId=State.Id  WHERE TenantOfficeInfo.Id=@TenantOfficeInfoId),
		(SELECT  TOP 1 State.GstStateCode FROM [State] LEFT JOIN TenantOfficeInfo ON TenantOfficeInfo.GstStateId=State.Id  WHERE TenantOfficeInfo.Id=@TenantOfficeInfoId),
		(SELECT  TOP 1 TenantOfficeInfo.GstNumber FROM TenantOfficeInfo WHERE TenantOfficeInfo.Id=@TenantOfficeInfoId),
		(SELECT  TOP 1 CustomerInfo.Name FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT TOP 1 CustomerInfo.BilledToAddress FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 City.Name FROM CustomerInfo LEFT JOIN City ON City.Id=BilledToCityId  WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 State.GstStateName FROM CustomerInfo LEFT JOIN State ON State.Id=BilledToStateId  WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 State.GstStateCode FROM CustomerInfo LEFT JOIN State ON State.Id=BilledToStateId  WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 CustomerInfo.BilledToPincode FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 CustomerInfo.BilledToGstNumber FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 CustomerInfo.Name FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 CustomerInfo.ShippedToAddress FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 City.Name FROM CustomerInfo LEFT JOIN City ON City.Id=ShippedToCityId  WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 State.GstStateName FROM CustomerInfo LEFT JOIN State ON State.Id=ShippedToStateId  WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT   TOP 1 State.GstStateCode FROM CustomerInfo LEFT JOIN State ON State.Id=ShippedToStateId WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 CustomerInfo.ShippedToPincode FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
		(SELECT  TOP 1 CustomerInfo.ShippedToGstNumber FROM CustomerInfo WHERE CustomerInfo.ID=@CustomerInfoId),
        (@InvoiceAmount - @DeductionAmount),
		@Cgst,
		@Sgst,
		@Igst,
	    (@InvoiceAmount - @DeductionAmount +@Cgst+@Sgst+@Igst),
		@HeaderUniqueID,
	   (SELECT TOP 1 Customer.CustomerCode FROM Customer LEFT JOIN CustomerInfo ON Customer.Id=CustomerInfo.CustomerId WHERE CustomerInfo.Id=@CustomerInfoId),
	   (SELECT TOP 1 Customer.CustomerCode FROM Customer LEFT JOIN CustomerInfo ON Customer.Id=CustomerInfo.CustomerId WHERE CustomerInfo.Id=@CustomerInfoId),
		'BESURE',
			1,
		@CreatedBy,
		GETUTCDATE()
	);

	INSERT INTO SalesRegisterDetails(
	Invoiceno,
	DescofService,
	SACCode,
	Qty,
	UOM,
	RateperUnit,
	Total,
	DiscountValue,
	TaxableValue,
	CGSTRate,
	CGSTAmount,
	SGSTRate,
	SGSTAmount,
	IGSTRate,
	IGSTAmount,
	TaxType,
	TCSValue,
	TCSRate,
	HeaderUniqueID,
	Uniqueid,
	CreatedBy,
	CreatedOn
	) 
		SELECT
	@InvoiceNumber ,
	ItemDescription,
	ServicingAccountingCode,
	Quantity,
	'OTH',
	Rate,
	((Quantity*Rate-ISNULL(Discount, 0))+ (Quantity*Rate-ISNULL(Discount, 0))*Sgst/100 + (Quantity*Rate-ISNULL(Discount, 0))*Cgst/100 +(Quantity*Rate-ISNULL(Discount, 0))*Igst/100),
	ISNULL(Discount, 0),
	Amount-ISNULL(Discount, 0),
	Cgst,
	(Quantity*Rate-ISNULL(Discount, 0))*Cgst/100 ,
	Sgst,
    (Quantity*Rate-ISNULL(Discount, 0))*Sgst/100 ,
    Igst, 
    (Quantity*Rate-ISNULL(Discount, 0))*Igst/100 ,
	(CASE WHEN @Sgst > 0 THEN 'SGST' ELSE 'IGST' END),
	0,
	0,
	@HeaderUniqueID,
	(SELECT NEWID()),
	@CreatedBy,
	SYSUTCDATETIME()
    FROM OPENJSON(@ContractInvoiceDetail)
	WITH(
	ItemDescription VARCHAR(128),
	ServicingAccountingCode VARCHAR(8),
	Quantity DECIMAL(16,2),
	Unit DECIMAL(16,2),
	Rate DECIMAL(16,2),
	Amount DECIMAL(16,2),
	Discount DECIMAL(16,2),
	Sgst DECIMAL(16,2),
	Cgst DECIMAL(16,2),
	Igst DECIMAL(16,2),
	NetAmount DECIMAL(16,2)
	)

	  SELECT * FROM @InsertedEInvoiceHeader;
	COMMIT TRANSACTION
END 