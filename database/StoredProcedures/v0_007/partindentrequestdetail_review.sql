CREATE OR ALTER   PROCEDURE [dbo].[partindentrequestdetail_review]
    @Id INT,
    @ReviewedBy INT,
	@StockTypeId INT,
    @ReviewerComments NVARCHAR(128) = NULL,
    @RequestStatus VARCHAR(8),
	@PartId INT,
	@TenantOfficeId INT,
	@IndentRequestNumber VARCHAR(32),
	@Quantity INT,
	@WorkOrderNumber VARCHAR(16)
AS 
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	
	DECLARE @RequestStatusId INT;
	SELECT @RequestStatusId = Id FROM MasterEntityData WHERE Code = @RequestStatus

	BEGIN TRANSACTION
	
    UPDATE PartIndentRequestDetail
    SET ReviewerComments = @ReviewerComments,
        RequestStatusId = @RequestStatusId,
        ReviewedBy = @ReviewedBy,
        ReviewedOn = GETUTCDATE()
    WHERE Id = @Id

	DECLARE @PIRId INT =(SELECT PartIndentRequestId FROM PartIndentRequestDetail WHERE Id=@Id)

	DECLARE @Count INT ;
	SET @Count = 
		(SELECT ISNULL(count(PartIndentRequestDetail.Id),0) FROM PartIndentRequestDetail 
		LEFT JOIN MasterEntityData ON MasterEntityData.Id=PartIndentRequestDetail.RequestStatusId
		WHERE MasterEntityData.Code IN ( 'PRT_CRTD' ,'PRT_HOLD') AND PartIndentRequestDetail.PartIndentRequestId= @PIRId)

	DECLARE @DemandNoteId INT; 
	DECLARE @DemandNoteStatusId INT;
	DECLARE @TenantOfficeCode VARCHAR(32);

	DECLARE @DemandNumber NVARCHAR(20)
	DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @Year INT = YEAR(@CurrentDate)
	DECLARE @Month INT = MONTH(@CurrentDate)
	DECLARE @FyStartMonth INT;
	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';
	IF @Month < @FyStartMonth
	SET @Year = @Year - 1
	SET @Year=@Year%100;
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)
	

	SELECT @DemandNoteStatusId = Id FROM MasterEntityData WHERE Code ='DNS_OPEN';
			
	EXEC [dbo].[documentnumberformat_get_nextnumber]
		@DocumentTypeCode = 'DCT_DND',
		@Year = @Year,
		@TenanatOfficeId = @TenantOfficeId,
		@DocumentNumber = @DemandNumber OUTPUT;

	IF(@Count = 0)
	UPDATE PartIndentRequest SET IsProcessed=1 WHERE Id=@PIRId

	IF(@RequestStatus = 'PRT_APRV')
	INSERT INTO PartIndentDemand
    (	
		DemandNumber,
		DemandDate,
		DemantNoteStatusId,
		PartId,
		PartIndentRequestNumber,
		PartIndentRequestDetailId,
		TenantOfficeId,
		UnitOfMeasurementId,
		WorkOrderNumber,
		StockTypeId,
		Price,
		Quantity,
		Remarks,
		CreatedBy,
		CreatedOn
	)
    VALUES (
		@DemandNumber,
        GETUTCDATE(),
		@DemandNoteStatusId,
		@PartId,
		@IndentRequestNumber,
		@Id,
		@TenantOfficeId,
		(SELECT Id FROM MasterEntityData WHERE Code ='UOM_NUMS'),
        @WorkOrderNumber,
		@StockTypeId,
		NULL,
		@Quantity,
		@ReviewerComments,
		@ReviewedBy,
        GETUTCDATE()
	)

	COMMIT TRANSACTION
END
