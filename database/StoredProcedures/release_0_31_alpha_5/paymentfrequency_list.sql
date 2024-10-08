CREATE OR ALTER PROCEDURE [dbo].[paymentfrequency_list]
@Page			INT=1,
@PerPage   		INT=5,
@Search			VARCHAR(50)=NULL
AS
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
	SET @Page = 1;
    SELECT
		PM.Id,
		PM.Code,
		PM.[Name],
		PM.CalendarMonths,
		PM.IsActive,
		CreatedUser.FullName AS CreatedByFullName,
		PM.CreatedOn,
		UpdatedUser.FullName AS UpdatedByFullName,
		PM.UpdatedOn
	FROM PaymentFrequency PM
	LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id = PM.CreatedBy
	LEFT JOIN UserInfo UpdatedUser ON UpdatedUser.Id = PM.UpdatedBy
	WHERE 
		(@Search IS NULL OR PM.[Name] LIKE   '%' + @Search + '%' )
	ORDER BY PM.CreatedOn DESC OFFSET (@Page-1)*@PerPage ROWS FETCH NEXT  @PerPage ROWS ONLY
END 
