CREATE OR ALTER PROCEDURE [dbo].[country_update]
    @Id INT,
    @IsoThreeCode VARCHAR(3),
    @IsoTwoCode VARCHAR(2),
    @Name VARCHAR(64),
    @CurrencyCode VARCHAR(3),
    @CallingCode VARCHAR(8),
    @CurrencyName VARCHAR(16),
    @CurrencySymbol VARCHAR(8),
    @UpdatedBy INT
AS
BEGIN 
    SET NOCOUNT ON;

    UPDATE Country
    SET 
        IsoThreeCode = @IsoThreeCode,
        IsoTwoCode = @IsoTwoCode,
        Name = @Name,
        CurrencyCode = @CurrencyCode,
        CallingCode = @CallingCode,
        CurrencyName = @CurrencyName,
        CurrencySymbol = @CurrencySymbol,
        UpdatedBy = @UpdatedBy,
        UpdatedOn = GETUTCDATE()
    WHERE Id = @Id;
END