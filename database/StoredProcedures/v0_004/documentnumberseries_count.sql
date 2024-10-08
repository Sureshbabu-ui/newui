CREATE OR ALTER PROCEDURE [dbo].[documentnumberseries_count] 
    @DocumentTypeId INT = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id) 
    FROM DocumentNumberSeries DNS
    WHERE (@DocumentTypeId IS NULL OR DNS.DocumentTypeId = @DocumentTypeId)
END