CREATE OR ALTER   PROCEDURE [dbo].[goodsissuereceivednote_part_allocate] 
    @PartIndentDemandId INT,
    @TenantOfficeId INT,
	@PartStockData NVARCHAR(MAX),
    @CreatedBy INT
AS 
BEGIN
    SET NOCOUNT ON;
	SET XACT_ABORT ON; 
    BEGIN TRANSACTION;

	DECLARE @StockRoomId INT;
	SELECT @StockRoomId = Id FROM StockRoom WHERE RoomCode = 'S003'

    INSERT INTO GoodsIssuedReceivedNote (
		AllocatedOn,
        TenantOfficeId,
        PartIndentDemandId,
        CreatedBy,
        CreatedOn
        )
	VALUES(        
		GETUTCDATE(),
        @TenantOfficeId,
		@PartIndentDemandId,
		@CreatedBy,
        GETUTCDATE()
	)
    
	DECLARE @GoodsIssuedReceivedNoteId INT = SCOPE_IDENTITY();

    -- Insert into GoodsIssuedReceivedDetail
    INSERT INTO GoodsIssuedReceivedDetail (
		GoodsIssuedReceivedNoteId,
        PartStockId,
        IssuedQuantity
        )
	SELECT
        @GoodsIssuedReceivedNoteId,
		JSON.PartStockId,
        1
    FROM OPENJSON(@PartStockData) WITH (
        PartStockId INT
    ) AS JSON

	-- Update PartStock table
	UPDATE PartStock 
	SET StockRoomId = @StockRoomId
	WHERE Id IN (
	SELECT PartStockId
	FROM OPENJSON(@PartStockData) WITH ( PartStockId INT ) AS JSON) ;

    COMMIT TRANSACTION;	
END
