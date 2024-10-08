CREATE OR ALTER   PROCEDURE [dbo].[loginhistory_list]
    @Page INT = 1,
	@PerPage INT = 10,
    @UserId INT = NULL,
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1
	SET @Page = 1;
	IF @DateFrom IS NULL OR @DateTo = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
	SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

    SELECT 
        UI.FullName AS EmployeeName,
        UI.EmployeeCode AS EmployeeCode,
        ULH.CreatedOn AS LoginDate,
		ULH.LoggedOutOn,
		ULH.ClientInfo,
        T.OfficeName AS Location,
        D.Name AS Designation
    FROM UserLoginHistory ULH
		LEFT JOIN UserLogin UL ON UL.Id = ULH.UserId
		LEFT JOIN UserInfo UI ON UI.UserLoginId = ULH.UserId
		LEFT JOIN Designation D ON D.Id = UI.DesignationId
		LEFT JOIN TenantOffice T ON T.Id = UI.TenantOfficeId
    WHERE
		(@UserId IS NULL OR ULH.UserId = @UserId) AND
		ULH.CreatedOn BETWEEN CAST(@DateFrom AS DATETIME) AND CAST(@DateTo AS DATETIME)
		ORDER BY ULH.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END