CREATE OR ALTER PROCEDURE [dbo].[impreststock_create_for_customer] 
	@PartStockIdList NVARCHAR(MAX),
    @Remarks VARCHAR(128) = NULL,
    @ContractId INT,
    @CustomerId INT,
    @CustomerSiteId INT = NULL,
	@ServiceEngineerId INT = NULL,
    @ReservedTo DATETIME,
    @ReservedFrom DATETIME,
	@CreatedBy INT,
	@IsCustomerSite BIT
AS 
BEGIN
    SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	DECLARE @StockRoomId INT;

	IF @IsCustomerSite = 1 
		SET @StockRoomId = (SELECT Id FROM StockRoom WHERE RoomCode = 'SM02');
	ELSE 
		SET @StockRoomId = (SELECT Id FROM StockRoom WHERE RoomCode = 'SM01');

	BEGIN TRANSACTION;
    
	INSERT INTO ImprestStock
	(
		PartStockId,
		CustomerId,
		ContractId,
		CustomerSiteId,
		ServiceEngineerId,
		ReservedFrom,
		ReservedTo,
		Remarks,
		AllocatedOn,
		AllocatedBy
    ) 
	SELECT
		StockIdList.VALUE AS PartStockId,
		@CustomerId,
		@ContractId,
		@CustomerSiteId,
		@ServiceEngineerId,
		@ReservedFrom,
		@ReservedTo,
		@Remarks,
        GETUTCDATE(),
		@CreatedBy
	FROM  OPENJSON(@PartStockIdList) AS StockIdList;

	UPDATE PartStock 
	SET 
		StockRoomId = @StockRoomId,
		IsStandby = 1
	FROM  OPENJSON(@PartStockIdList) WITH (Id INT '$') AS StockIdList
	WHERE PartStock.Id = StockIdList.Id;
    
	COMMIT TRANSACTION;
END