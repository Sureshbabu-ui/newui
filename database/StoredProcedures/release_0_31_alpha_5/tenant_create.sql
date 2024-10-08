CREATE OR ALTER PROCEDURE [dbo].[tenant_create]
	@TenantCode VARCHAR(32),
	@Name VARCHAR(64),
	@NameOnPrint VARCHAR(64),
	@Address VARCHAR(128),
	@CreatedBy INT,
	@IsTenantCreated INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SET XACT_ABORT ON; 
	BEGIN TRAN
	DECLARE @LastInsertedId NVARCHAR(10);

	INSERT INTO Tenant
		(TenantCode,
		CreatedBy,
		CreatedOn) 
	VALUES
		(@TenantCode,
		@CreatedBy,
		GETUTCDATE())

	SET @LastInsertedId=SCOPE_IDENTITY()

	INSERT INTO TenantInfo
		(TenantId,
		[Name],
		NameOnPrint,
		[Address],
		IsVerified,
		EffectiveFrom,
		EffectiveTo,
		CreatedBy,
		CreatedOn)
	VALUES
		(@LastInsertedId,
		@Name,
		@NameOnPrint,
		@Address,
		0,
		GETUTCDATE(),
		NULL	,
		@CreatedBy,
		GETUTCDATE())
		SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
	IF (@LastInsertedId IS NOT NULL)
		SET @IsTenantCreated = 1
	ELSE
		SET @IsTenantCreated = 0
	COMMIT TRAN
END 