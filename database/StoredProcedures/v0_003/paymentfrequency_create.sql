CREATE OR ALTER PROCEDURE [dbo].[paymentfrequency_create]
    @Name VARCHAR(64),
    @Code VARCHAR(8),
    @CalendarMonths INT,
    @CreatedBy INT,
    @IsActive BIT
AS
BEGIN 
    SET NOCOUNT ON;
	INSERT INTO PaymentFrequency(
		[Name],
		Code,
        CalendarMonths,
        IsActive,
        CreatedBy,
        CreatedOn
        ) 
        VALUES (
        @Name,
		@Code,
        @CalendarMonths,
        @IsActive,
        @CreatedBy,
        GETUTCDATE()
        )
END
