CREATE OR ALTER PROCEDURE [dbo].[masterentitydata_get_table_details]
	@EntityId INT,
	@Search	VARCHAR(50)=NULL
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		[Name],
		Code,
		IsActive,
		IsSystemData,
		CreatedBy,
		CreatedOn,
		ModifiedBy,
		ModifiedOn
	FROM MasterEntityData
	WHERE 
		(ISNULL(@Search, '') = '' OR [Name] LIKE + @Search + '%') 
		AND MasterEntityId= @EntityId AND IsDeleted = 0
END