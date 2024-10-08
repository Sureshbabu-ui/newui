CREATE OR ALTER PROCEDURE [dbo].[documentnumberformat_count] 
    @DocumentTypeId INT = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id) 
    FROM DocumentNumberFormat DNF
    WHERE (@DocumentTypeId IS NULL OR DNF.DocumentTypeId = @DocumentTypeId)
END