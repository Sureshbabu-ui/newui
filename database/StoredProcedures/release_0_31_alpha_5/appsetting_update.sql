CREATE OR ALTER PROCEDURE [dbo].[appsetting_update] 
    @UpdatedBy INT,
    @AppKey VARCHAR(64),
	@AppValue VARCHAR(64)
AS
BEGIN 
    SET NOCOUNT ON;
    UPDATE AppSetting
    SET 
        AppValue = NULLIF(@AppValue, ''),
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
    WHERE 
        AppKey = @AppKey 
END