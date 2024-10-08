CREATE OR ALTER     PROCEDURE [dbo].[partindentrequest_create]
    @ServiceRequestId INT,
	@TenantOfficeId INT,
	@RequestedBy INT,
    @Remarks varchar(128),
    @CreatedBy INT,
	@PartIndentDetail NVARCHAR(max),
    @IsPartRequestCreated INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
	BEGIN TRANSACTION

	DECLARE @ReviewStatusId INT;
	DECLARE @WorkOrderNumber VARCHAR(16);
	DECLARE @IndentRequestNumber VARCHAR(32); 

	SELECT @ReviewStatusId = Id FROM MasterEntityData WHERE Code ='PRT_CRTD'
	SELECT @WorkOrderNumber = WorkOrderNumber FROM ServiceRequest WHERE Id = @ServiceRequestId;
	IF @TenantOfficeId IS NULL
	  SET @TenantOfficeId=(SELECT TenantOfficeId FROM UserInfo
	  WHERE Id=@CreatedBy);
	-- Generate IndentRequestNumber
	DECLARE @CurrentDate DATETIME = GETUTCDATE();
	DECLARE @Year INT = YEAR(@CurrentDate);
	DECLARE @Month INT = MONTH(@CurrentDate);
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';
	IF @Month < @FyStartMonth
	SET @Year = @Year - 1
	SET @Year = @Year % 100
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	EXEC [dbo].[documentnumberformat_get_nextnumber]
		@DocumentTypeCode = 'DCT_PIN',
		@Year = @Year,
		@TenantOfficeId = @TenantOfficeId,
		@DocumentNumber = @IndentRequestNumber OUTPUT;

    INSERT INTO PartIndentRequest(
		IndentRequestNumber,
		ServiceRequestId,
		TenantOfficeId,
		AssetProductCategoryId,
	    RequestedBy,
		Remarks,
		CreatedBy,
		CreatedOn
    )
    VALUES (
        @IndentRequestNumber,
        @ServiceRequestId,
		@TenantOfficeId, -- TODO: TenantOfficeId should be accel office location
		(
		SELECT A.AssetProductCategoryId 
		FROM 
			ServiceRequest 
		LEFT JOIN ContractAssetDetail CAD ON ServiceRequest.ContractAssetId = CAD.Id 
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		WHERE ServiceRequest.Id = @ServiceRequestId AND CAD.IsActive = 1
		),
		@RequestedBy,
		@Remarks,
		@CreatedBy,
		GETUTCDATE()
    );

	DECLARE @PartIndentRequestId INT; 
	SET @PartIndentRequestId = SCOPE_IDENTITY();

	INSERT INTO PartIndentRequestDetail(
		StockTypeId,
		IsWarrantyReplacement,
		PartIndentRequestId,
		PartId,
		Quantity,
		RequestStatusId,
		CreatedBy,
		CreatedOn
	)
	SELECT
		JSON.StockTypeId,
		JSON.IsWarrantyReplacement,
		@PartIndentRequestId,
		JSON.Id,
		JSON.Quantity,
		(SELECT Id FROM MasterEntityData WHERE MasterEntityData.Code='PRT_CRTD'),
		@CreatedBy,
		GETUTCDATE()
	FROM OPENJSON(@PartIndentDetail)
	WITH(
		Id INT,
		Quantity DECIMAL(16,2),
		IsWarrantyReplacement BIT,
		StockTypeId INT
		)  AS JSON

    SET @IsPartRequestCreated = 1;
	COMMIT TRANSACTION
END
