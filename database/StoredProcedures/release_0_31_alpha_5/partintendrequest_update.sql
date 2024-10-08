CREATE OR ALTER   PROCEDURE [dbo].[partintendrequest_update] 
    @Id INT,
    @PartCode VARCHAR(8),
    @StockTypeId INT,
    @Quantity INT,
    @IsWarrantyReplacement BIT,
    @UpdatedBy INT,
    @IsUpdated BIT OUTPUT 
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @PartId INT;
	SELECT @PartId = Id FROM Part WHERE PartCode = @PartCode
	IF (@PartId IS NOT NULL)
	BEGIN
		UPDATE PartIndentRequestDetail
		SET 
			PartId = @PartId,
			StockTypeId = @StockTypeId,
			Quantity = @Quantity,
			IsWarrantyReplacement = @IsWarrantyReplacement,
			UpdatedBy = @UpdatedBy,
			UpdatedOn = GETUTCDATE()
		WHERE 
			Id = @Id
		SET @IsUpdated = 1
	END
	ELSE
	BEGIN
		SET @IsUpdated = 0
	END
END 