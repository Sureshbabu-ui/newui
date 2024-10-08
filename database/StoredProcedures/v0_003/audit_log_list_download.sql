CREATE OR ALTER PROCEDURE [dbo].[audit_log_list_download]
	@TableName NVARCHAR(64),
	@StartDate DATETIME = NULL, 
	@EndDate DATETIME = NULL,  
	@Action NVARCHAR(64) = NULL  
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Query NVARCHAR(MAX);
	DECLARE @Columns NVARCHAR(MAX);
	DECLARE @HasCreatedBy BIT = 0;
	DECLARE @HasUpdatedBy BIT = 0;
	DECLARE @HasDeletedBy BIT = 0;

	-- Check if the columns exist
	IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'dbo_' + @TableName + '_CT' AND COLUMN_NAME = 'CreatedBy')
		SET @HasCreatedBy = 1;
	IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'dbo_' + @TableName + '_CT' AND COLUMN_NAME = 'UpdatedBy')
		SET @HasUpdatedBy = 1;
	IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'dbo_' + @TableName + '_CT' AND COLUMN_NAME = 'DeletedBy')
		SET @HasDeletedBy = 1;

	-- Get the list of columns excluding the specified ones
	SELECT @Columns = (SELECT STUFF((
        SELECT ',tb.' + COLUMN_NAME
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE TABLE_NAME = 'dbo_' + @TableName + '_CT'	  AND COLUMN_NAME NOT IN ('__$start_lsn', '__$seqval', '__$update_mask', '__$command_id', '__$end_lsn', '__$operation','Id','CreatedBy','UpdatedBy','DeletedBy')
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 1, ''));



	-- Construct the dynamic query
	SET @Query = N'SELECT 
                      CONVERT(VARCHAR, tm.tran_begin_time, 29) AS [Transaction Time], 
					  tb.Id AS RowId,

                      CASE __$operation 
                          WHEN 3 THEN ''Before Update'' 
                          WHEN 4 THEN ''After Update'' 
                          WHEN 1 THEN ''Delete'' 
                          WHEN 2 THEN ''Insert'' 
                      END AS [Operation], ' +
                      CASE WHEN @HasCreatedBy = 1 THEN 'UI.FullName AS CreatedBy, ' ELSE '' END +
                      CASE WHEN @HasUpdatedBy = 1 THEN 'UIU.FullName AS UpdatedBy, ' ELSE '' END +
                      CASE WHEN @HasDeletedBy = 1 THEN 'UID.FullName AS DeletedBy, ' ELSE '' END +
                      @Columns + ' 
                   FROM cdc.dbo_' + @TableName + '_CT tb
                   LEFT JOIN cdc.lsn_time_mapping tm ON tb.__$start_lsn = tm.start_lsn ' +
                   CASE WHEN @HasCreatedBy = 1 THEN 'LEFT JOIN UserInfo UI ON UI.Id = tb.CreatedBy ' ELSE '' END +
                   CASE WHEN @HasUpdatedBy = 1 THEN 'LEFT JOIN UserInfo UIU ON UIU.Id = tb.UpdatedBy ' ELSE '' END +
                   CASE WHEN @HasDeletedBy = 1 THEN 'LEFT JOIN UserInfo UID ON UID.Id = tb.DeletedBy ' ELSE '' END +
                   'WHERE (@StartDate IS NULL OR tm.tran_begin_time >= @StartDate)
                     AND (@EndDate IS NULL OR tm.tran_begin_time <= @EndDate)
                     AND (@Action IS NULL OR (@Action = ''U'' AND tb.__$operation IN (3, 4)
                                             OR @Action = ''I'' AND tb.__$operation = 2
                                             OR @Action = ''D'' AND tb.__$operation = 1))';

	-- Execute the dynamic query
	EXEC sp_executesql @Query,
                       N'@StartDate DATETIME, @EndDate DATETIME, @Action NVARCHAR(5)',
                       @StartDate, @EndDate, @Action;
END
