CREATE OR ALTER PROCEDURE [dbo].[userloginhistory_list_download]
    @UserId INT = NULL,
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TimeZone VARCHAR(64)
AS
BEGIN 
    SET NOCOUNT ON;
    DECLARE @DateTimeFormat VARCHAR(16) = 'dd-MM-yyyy HH:mm:ss';

    IF @DateFrom IS NULL OR @DateTo = ''
        SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
        SET @DateTo = CAST(GETUTCDATE() AS DATE);
    SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

    SELECT 
        UI.FullName AS EmployeeName,
        UI.EmployeeCode AS EmployeeCode,
        FORMAT(CAST(ULH.CreatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone, @DateTimeFormat) AS LoginDate,
        T.OfficeName AS Location,
        D.Name AS Designation,
        FORMAT(CAST(ULH.LoggedOutOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone, @DateTimeFormat) AS LoggedOutOn
    FROM UserLoginHistory ULH
        LEFT JOIN UserLogin UL ON UL.Id = ULH.UserId
        LEFT JOIN UserInfo UI ON UI.UserLoginId = ULH.UserId
        LEFT JOIN Designation D ON D.Id = UI.DesignationId
        LEFT JOIN TenantOffice T ON T.Id = UI.TenantOfficeId
    WHERE
        (@UserId IS NULL OR ULH.UserId = @UserId) AND
        ULH.CreatedOn BETWEEN CAST(@DateFrom AS DATETIME) AND CAST(@DateTo AS DATETIME)
    ORDER BY ULH.CreatedOn DESC 
END
