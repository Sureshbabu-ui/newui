
CREATE OR ALTER PROCEDURE [dbo].[rolebusinessfunctionpermission_update]
    @RoleFunctionPermissions NVARCHAR(MAX),
    @CreatedBy INT
AS 
BEGIN 
    BEGIN TRANSACTION 
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 
     MERGE INTO RoleBusinessFunctionPermission AS target
        USING (
        SELECT 
            Id,
            RoleId,
            BusinessFunctionId,
            Status
        FROM OPENJSON(@RoleFunctionPermissions)
            WITH (
                Id INT,
                RoleId INT,
                BusinessFunctionId INT,
                Status BIT
            )
    ) AS source ON target.Id = source.Id
    WHEN MATCHED AND ( source.Status = 0)  
	THEN
	    DELETE 
    WHEN NOT MATCHED AND (source.Status = 1) 
	THEN
        INSERT (
           RoleId,
            BusinessFunctionId,
            CreatedOn,
            CreatedBy 
        ) VALUES (            
            source.RoleId,
            source.BusinessFunctionId,
            GETUTCDATE(),
            @CreatedBy
        );
COMMIT TRANSACTION 
END 