CREATE OR ALTER PROCEDURE [dbo].[goodsreceivednotedetail_create_for_se_partreturn]
    @GrnId INT,
    @IsGrnCompleted BIT,
    @PartStockList NVARCHAR(max),
    @GrnTransactionTypeCode VARCHAR(8),
    @CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
    
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
    
    FETCH NEXT FROM PartStockData INTO @GoodsReceivedNoteId, @PartId, @Barcode, @SerialNumber,@Rate, @StockTypeId, @PartStockId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO GoodsReceivedNoteDetail (GoodsReceivedNoteId, PartId, SerialNumber, Rate)
        VALUES (@GoodsReceivedNoteId, @PartId, @SerialNumber, @Rate);

        SET @GRNDetailId = SCOPE_IDENTITY();

		-- Based on the value of ReturnedPartTypeCode, insertion or updating will be performed.
		DECLARE @ReturnedPartTypeCode VARCHAR(8); 

		SELECT @ReturnedPartTypeCode = MED.Code
		FROM MasterEntityData MED
				LEFT JOIN GoodsReceivedNote GRN ON GRN.Id = @GrnId
				LEFT JOIN PartReturn PR ON PR.Id = GRN.TransactionId
		WHERE MED.Id = PR.ReturnedPartTypeId;

			IF (@ReturnedPartTypeCode = 'RPT_DFCT')
			BEGIN
			    DECLARE @DFCTStockRoomId INT = (SELECT Id FROM StockRoom WHERE RoomCode = 'S100');
				
				INSERT INTO PartStock (PartId, SerialNumber, Rate, Barcode, TenantOfficeId, GrnDetailId, StockRoomId, StockTypeId, CreatedBy, CreatedOn)
				VALUES (@PartId, @SerialNumber, @Rate, @Barcode, @TenantOfficeId, @GRNDetailId, @DFCTStockRoomId, @StockTypeId, @CreatedBy, GETUTCDATE());

				UPDATE Part 
				SET Quantity = ISNULL(Quantity, 0) + 1 
				WHERE Id = @PartId;
			END
			
			IF (@ReturnedPartTypeCode = 'RPT_DOAR')
			BEGIN
			DECLARE @DOARStockRoomId INT = (SELECT Id FROM StockRoom WHERE RoomCode = 'S008');

			UPDATE PartStock 
            SET StockRoomId = @DOARStockRoomId,
                TenantOfficeId = @TenantOfficeId,
                GrnDetailId = @GRNDetailId
            WHERE SerialNumber = @SerialNumber;
			END

			IF (@ReturnedPartTypeCode = 'RPT_UNUS' OR @ReturnedPartTypeCode = 'RPT_WRPT')
			BEGIN
			DECLARE @StockRoomId INT = (SELECT Id FROM StockRoom WHERE RoomCode = 'S006');
			UPDATE PartStock 
            SET StockRoomId = @StockRoomId,
                TenantOfficeId = @TenantOfficeId,
                GrnDetailId = @GRNDetailId
            WHERE SerialNumber = @SerialNumber;
			END

        FETCH NEXT FROM PartStockData INTO @GoodsReceivedNoteId, @PartId, @Barcode, @SerialNumber, @Rate, @StockTypeId, @PartStockId;
    END;

    CLOSE PartStockData;
    DEALLOCATE PartStockData;
    
    IF @IsGrnCompleted = 1
    BEGIN
        UPDATE GoodsReceivedNote SET IsProcessed = 1 WHERE Id = @GrnId;
        UPDATE PartReturn 
		SET ReceivedOn = GETUTCDATE(),
			ReceivedBy = @CreatedBy
		FROM PartReturn 
		     LEFT JOIN GoodsReceivedNote GRN ON GRN.TransactionId = PartReturn.Id
		WHERE GRN.Id = @GrnId
    END

    COMMIT TRANSACTION;
END;
