CREATE OR ALTER     PROCEDURE [dbo].[loginhistory_count] 
	@UserId INT = NULL,
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	IF @DateFrom IS NULL OR @DateTo = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
	SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));
 
		SELECT @TotalRows = COUNT(ULH.Id)
		FROM UserLoginHistory ULH
		WHERE
		(@UserId IS NULL OR ULH.UserId = @UserId) AND
        ULH.CreatedOn BETWEEN CAST(@DateFrom AS DATETIME) AND CAST(@DateTo AS DATETIME)

END

