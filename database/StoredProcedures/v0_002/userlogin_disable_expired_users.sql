CREATE OR ALTER PROCEDURE [dbo].[userlogin_disable_expired_users]
AS
BEGIN
SET NOCOUNT ON;
	UPDATE UserLogin
	SET 
		UserLogin.IsActive = 0, 
		UserLogin.DeactivatedOn = GETUTCDATE()
	FROM 
		UserLogin
		INNER JOIN UserInfo ON UserInfo.UserLoginId = UserLogin.Id
	WHERE 
		((UserInfo.ExpiryDate IS NOT NULL) AND 
		 UserInfo.ExpiryDate <= GETDATE()) AND
		 UserInfo.IsActive = 1 AND UserLogin.IsActive = 1
END