CREATE OR ALTER PROCEDURE [dbo].[country_create] 
    @IsoThreeCode VARCHAR(3),
	@IsoTwoCode VARCHAR(2),
	@Name VARCHAR(64),
	@CurrencyCode VARCHAR(3),
	@CallingCode VARCHAR(8),
	@CurrencyName VARCHAR(16),
	@CurrencySymbol VARCHAR(8),
    @CreatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;
    INSERT INTO Country (
		IsoThreeCode,
		IsoTwoCode,
		CallingCode,
		CurrencyCode,
		CurrencyName,
		[Name],
		CurrencySymbol,
		CreatedBy,
		CreatedOn
	)
    VALUES (
		@IsoThreeCode,
		@IsoTwoCode,
		@CallingCode,
		@CurrencyCode,
		@CurrencyName,
		@Name,
		@CurrencySymbol,
        @CreatedBy,
        GETUTCDATE()
	)
END