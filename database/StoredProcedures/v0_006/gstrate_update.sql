CREATE OR ALTER PROCEDURE [dbo].[gstrate_update] 
	@Id INT,
    @TenantServiceName VARCHAR(64),
	@ServiceAccountDescription VARCHAR(128),
	@Sgst DECIMAL(5,2),
	@Igst DECIMAL(5,2),
	@Cgst DECIMAL(5,2),
	@IsActive BIT
AS
BEGIN 
	SET NOCOUNT ON;
	UPDATE	GstRate
	SET
		TenantServiceName  = @TenantServiceName,
		ServiceAccountDescription = @ServiceAccountDescription,
		Sgst = @Sgst,
		Cgst = @Cgst,
		Igst = @Igst,
		IsActive = @IsActive
	WHERE
		Id = @Id;
END