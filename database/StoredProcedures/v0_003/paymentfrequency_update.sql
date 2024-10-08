CREATE OR ALTER PROCEDURE [dbo].[paymentfrequency_update]
    @Id INT,
    @Name VARCHAR(64),
    @CalendarMonths INT,
    @UpdatedBy INT,
    @IsActive VARCHAR(8)
AS
BEGIN 
    SET NOCOUNT ON;
	UPDATE PaymentFrequency
		SET [Name] = @Name,
		CalendarMonths = @CalendarMonths,
        IsActive = @IsActive,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE Id = @Id
END