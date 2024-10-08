CREATE OR ALTER   PROCEDURE [dbo].[service_request_count]
    @Search     VARCHAR(50) = NULL,
    @SearchWith VARCHAR(50) = NULL,
    @IsInterimCase INT,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    DECLARE @SQL NVARCHAR(MAX);
    SET NOCOUNT ON;
	DECLARE @CaseStatusId INT;
	SELECT @CaseStatusId = Id From MasterEntityData WHERE Code = 'SRS_CLSD'

    SET @SQL = N'
    SELECT 
        @TotalRows = COUNT(SR.Id)
    FROM 
        ServiceRequest AS SR';

    IF (@SearchWith IS NOT NULL AND @SearchWith != '')
    BEGIN
        SET @SQL += N' WHERE ' + QUOTENAME(@SearchWith) + ' LIKE ''%' + @Search + '%''';

        IF @IsInterimCase = 1
            SET @SQL += N' AND IsInterimCaseId = 1 AND CaseStatusId != @CaseStatusId';
        ELSE IF @IsInterimCase = 0
            SET @SQL += N' AND (IsInterimCaseId = 0 OR IsInterimCaseId IS NULL)';
    END
    ELSE
    BEGIN
        IF @IsInterimCase = 1
            SET @SQL += N' WHERE IsInterimCaseId = 1 AND CaseStatusId != @CaseStatusId';
        ELSE IF @IsInterimCase = 0
            SET @SQL += N' WHERE (IsInterimCaseId = 0 OR IsInterimCaseId IS NULL)';
    END

    EXEC sp_executesql @SQL, N'@TotalRows INT OUTPUT, @CaseStatusId INT', @TotalRows OUTPUT, @CaseStatusId;
END