CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednotedetail_create_for_delivery_challan]
    @GrnId INT,
    @IsGrnCompleted BIT,
    @PartStockList NVARCHAR(max),
    @GrnTransactionTypeCode VARCHAR(8),
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
    
    DECLARE @StockRoomId INT = (SELECT Id FROM StockRoom WHERE RoomCode = 'S006');
    DECLARE @TenantOfficeId INT = (SELECT ReceivedLocationId FROM GoodsReceivedNote WHERE Id = @GrnId);
    DECLARE @GRNDetailId INT;
    
    BEGIN TRANSACTION;
    
    DECLARE @GoodsReceivedNoteId INT, @PartId INT, @Barcode VARCHAR(32), @SerialNumber VARCHAR(32), @Rate DECIMAL(16, 2), @StockTypeId INT, @PartStockId INT;
    
    DECLARE PartStockData CURSOR FOR
    SELECT GoodsReceivedNoteId, PartId, Barcode, SerialNumber, Rate, StockTypeId, PartStockId
    FROM OPENJSON(@PartStockList)
    WITH (
        GoodsReceivedNoteId INT,
        PartId INT,
        Barcode VARCHAR(32),
        SerialNumber VARCHAR(32),
        Rate DECIMAL(16, 2),
        StockTypeId INT,
        PartStockId INT
    );

    OPEN PartStockData;
    
    FETCH NEXT FROM PartStockData INTO @GoodsReceivedNoteId, @PartId, @Barcode, @SerialNumber, @Rate, @StockTypeId, @PartStockId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO GoodsReceivedNoteDetail (GoodsReceivedNoteId, PartId, SerialNumber, Rate)
        VALUES (@GoodsReceivedNoteId, @PartId, @SerialNumber, @Rate);

        SET @GRNDetailId = SCOPE_IDENTITY();

            UPDATE PartStock 
            SET StockRoomId = @StockRoomId,
                TenantOfficeId = @TenantOfficeId,
                GrnDetailId = @GRNDetailId
            WHERE Id = @PartStockId;

        FETCH NEXT FROM PartStockData INTO @GoodsReceivedNoteId, @PartId, @Barcode, @SerialNumber, @Rate, @StockTypeId, @PartStockId;
    END;

    CLOSE PartStockData;
    DEALLOCATE PartStockData;
    
    IF @IsGrnCompleted = 1
    BEGIN
        UPDATE GoodsReceivedNote SET IsProcessed = 1 WHERE Id = @GrnId;
    END

    COMMIT TRANSACTION;
END;