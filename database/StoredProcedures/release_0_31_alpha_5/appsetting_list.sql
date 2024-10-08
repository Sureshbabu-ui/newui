CREATE OR ALTER   PROCEDURE [dbo].[appsetting_list]
AS
BEGIN
	SELECT 
		Id,
		Appkey, 
		AppValue 
	FROM AppSetting
END