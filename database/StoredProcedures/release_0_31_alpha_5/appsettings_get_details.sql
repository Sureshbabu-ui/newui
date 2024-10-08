CREATE OR ALTER PROCEDURE [dbo].[appsettings_get_details]
	@AppkeyName VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		AppKey,
		AppValue
	FROM AppSetting	
	WHERE 
		AppKey = @AppkeyName 	
END