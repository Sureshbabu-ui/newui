CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednotedetail_create_for_purchase_order]
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
    DECLARE @PoStatusId INT = (SELECT Id FROM MasterEntityData WHERE Code = 'POS_CLSD');
    DECLARE @TenantOfficeId INT = (SELECT ReceivedLocationId FROM GoodsReceivedNote WHERE Id = @GrnId);
    DECLARE @GRNDetailId INT, @POId INT, @PODetailId INT;
    
    BEGIN TRANSACTION;
    
    DECLARE @GoodsReceivedNoteId INT, @PartId INT, @Barcode VARCHAR(32), @SerialNumber VARCHAR(32), @Quantity DECIMAL(16, 2), @Rate DECIMAL(16, 2), @StockTypeId INT, @PartStockId INT;
    
    DECLARE PartStockData CURSOR FOR
    SELECT GoodsReceivedNoteId, PartId, Barcode, SerialNumber, Quantity, Rate, StockTypeId, PartStockId
    FROM OPENJSON(@PartStockList)
    WITH (
        GoodsReceivedNoteId INT,
        PartId INT,
        Barcode VARCHAR(32),
        SerialNumber VARCHAR(32),
        Quantity DECIMAL(16, 2),
        Rate DECIMAL(16, 2),
        StockTypeId INT,
        PartStockId INT
    );

    OPEN PartStockData;
    
    FETCH NEXT FROM PartStockData INTO @GoodsReceivedNoteId, @PartId, @Barcode, @SerialNumber, @Quantity, @Rate, @StockTypeId, @PartStockId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO GoodsReceivedNoteDetail (GoodsReceivedNoteId, PartId, SerialNumber, Rate)
        VALUES (@GoodsReceivedNoteId, @PartId, @SerialNumber, @Rate);

        SET @GRNDetailId = SCOPE_IDENTITY();

            SELECT @POId = TransactionId, @PODetailId = POD.Id 
            FROM GoodsReceivedNote GRN
            LEFT JOIN PurchaseOrderDetail POD ON POD.PurchaseOrderId = GRN.TransactionId
            WHERE GRN.Id = @GoodsReceivedNoteId AND POD.PartId = @PartId;

            UPDATE PurchaseOrderDetail
            SET GrnReceivedQuantity = ISNULL(GrnReceivedQuantity, 0) + @Quantity
            WHERE PartId = @PartId AND Id = @PODetailId;

            INSERT INTO PartStock (PartId, SerialNumber, Rate, Barcode, TenantOfficeId, GrnDetailId, StockRoomId, StockTypeId, CreatedBy, CreatedOn)
            VALUES (@PartId, @SerialNumber, @Rate, @Barcode, @TenantOfficeId, @GRNDetailId, @StockRoomId, @StockTypeId, @CreatedBy, GETUTCDATE());

            UPDATE Part SET Quantity = ISNULL(Quantity, 0) + @Quantity WHERE Id = @PartId;
        FETCH NEXT FROM PartStockData INTO @GoodsReceivedNoteId, @PartId, @Barcode, @SerialNumber, @Quantity, @Rate, @StockTypeId, @PartStockId;
    END;

    CLOSE PartStockData;
    DEALLOCATE PartStockData;
    
    IF @IsGrnCompleted = 1
    BEGIN
    UPDATE GoodsReceivedNote SET IsProcessed = 1 WHERE Id = @GrnId;

    UPDATE PurchaseOrder 
    SET PoStatusId = @PoStatusId 
    FROM PurchaseOrder PO
        LEFT JOIN GoodsReceivedNote GRN ON GRN.TransactionId = PO.Id
    WHERE GRN.Id = @GrnId;
    END

    COMMIT TRANSACTION;
END;