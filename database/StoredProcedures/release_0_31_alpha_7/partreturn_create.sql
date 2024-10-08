CREATE OR ALTER   PROCEDURE [dbo].[partreturn_create]
	@ServiceRequestId INT,
	@ReturnedPartTypeId INT,
    @PartId INT,    
    @PartStockId INT,    
    @SerialNumber VARCHAR(128),
    @Barcode VARCHAR(32),
    @WarrantyEndDate DATE,
    @ReturnInitiatedBy INT,
    @ReturnRemarks NVARCHAR(128)
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	
     DECLARE @ReceivingLocationId INT =(SELECT TenantOfficeId FROM UserInfo WHERE Id=@ReturnInitiatedBy);
     INSERT INTO PartReturn
     (
		ServiceRequestId,
		ReturnedPartTypeId,
		PartId,
		PartStockId,
		SerialNumber,
		Barcode,
		WarrantyEndDate,
		ReturnRemarks,
		ReceivingLocationId,
		ReturnInitiatedBy,
		ReturnInitiatedOn
     ) 
     VALUES 
     ( 
        @ServiceRequestId,
		@ReturnedPartTypeId,
		@PartId,
		@PartStockId,
        @SerialNumber,
        @Barcode,
		@WarrantyEndDate,
		@ReturnRemarks,
		@ReceivingLocationId,
        @ReturnInitiatedBy,
        GETUTCDATE()
     )
END 