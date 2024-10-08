CREATE OR ALTER PROCEDURE [dbo].[notificationsetting_update]
@NotificationSettings NVARCHAR(MAX)
AS 
BEGIN 
    BEGIN TRANSACTION 
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
    MERGE INTO NotificationSetting AS target
    USING (
        SELECT 
            Id,
            RoleId,
            BusinessEventId,
            Email
        FROM OPENJSON(@NotificationSettings)
            WITH (
                Id INT,
                RoleId INT,
                BusinessEventId INT,
                Email BIT
            )
    ) AS source ON target.Id = source.Id
    WHEN MATCHED AND (source.Email = 0)  
	THEN
	    DELETE 
    WHEN MATCHED 
	THEN
        UPDATE SET
            RoleId = source.RoleId,
            BusinessEventId = source.BusinessEventId,
            Email = source.Email
    WHEN NOT MATCHED AND ( source.Email = 1) 
	THEN
        INSERT (
            RoleId,
            BusinessEventId,
            Email
        ) VALUES (            
            source.RoleId,
            source.BusinessEventId,
            source.Email
        );
COMMIT TRANSACTION 
END 