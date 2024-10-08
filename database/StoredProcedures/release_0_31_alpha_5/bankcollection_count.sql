CREATE OR ALTER PROCEDURE [dbo].[bankcollection_count] 
    @Search VARCHAR(50) = NULL,
    @BankCollectionStatus VARCHAR(8),
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(BC.Id)
	FROM BankCollection BC
	LEFT JOIN MasterEntityData MED ON MED.Id= BC.BankCollectionStatusId
	WHERE 
		(@Search IS NULL OR 
		Particulars LIKE '%' + @Search + '%') AND
		MED.Code = @BankCollectionStatus;
END
	