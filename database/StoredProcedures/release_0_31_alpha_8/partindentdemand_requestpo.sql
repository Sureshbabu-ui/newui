CREATE OR ALTER PROCEDURE [dbo].[partindentdemand_requestpo]
	@Id INT,
	@Price DECIMAL(16,2),
	@VendorId INT,
	@StockTypeId INT,
	@WarrantyPeriod INT,
	@UpdatedBy INT
AS 
BEGIN 
	SET NOCOUNT ON;
	UPDATE PartIndentDemand
	SET 
			Price	  =	  @Price,
			StockTypeId = @StockTypeId,
			WarrantyPeriod = @WarrantyPeriod,
			VendorId  =	  @VendorId,
			UpdatedBy =   @UpdatedBy,
			UpdatedOn =	  GETUTCDATE(),
			IsCwhAttentionNeeded = 1
	WHERE 
		Id = @Id
END