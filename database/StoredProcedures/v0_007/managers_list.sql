CREATE OR ALTER   PROCEDURE [dbo].[managers_list]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		UI.Id,
		UI.FullName 
	FROM UserInfo UI
	LEFT JOIN MasterEntityData MED ON UI.UserGradeId = MED.Id
	WHERE UI.IsDeleted = 0
		AND (MED.Code NOT IN (
								'USR_GP01',
								'USR_GP02', -- users from p4 to p10
								'USR_GP03'
								)
			)
		
END 
