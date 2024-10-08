CREATE OR ALTER PROCEDURE [dbo].[rolebusinessfunctionpermission_rolewise_list]
  @RoleId INT,
  @BusinessFunctionType VARCHAR(50),
  @BusinessModuleId INT = NULL

AS
BEGIN 
SET NOCOUNT ON;

    DECLARE @BusinessFunctionTypeId INT = (SELECT Id FROM MasterEntityData WHERE Code=@BusinessFunctionType)
	SELECT 
        ISNULL(RP.Id, 0) AS Id,
        @RoleId AS RoleId,
        BF.Id AS BusinessFunctionId,
        BF.BusinessFunctionName AS Name,
		BF.BusinessModuleId,
		BM.BusinessModuleName,
		BF.Description,
		BM.Description AS BusinessModuleDescription,
		  CASE
            WHEN RP.Id IS NULL THEN 0
            ELSE 1
        END AS Status
    FROM
        BusinessFunction AS BF
    LEFT JOIN RoleBusinessFunctionPermission as RP ON RP.BusinessFunctionId = BF.Id AND RP.RoleId = @RoleId
	LEFT JOIN BusinessModule As BM ON BF.BusinessModuleId=BM.Id
    WHERE
        BF.IsActive = 1		AND 
		BF.BusinessFunctionTypeId = @BusinessFunctionTypeId AND
		(@BusinessModuleId IS NULL OR
        BM.Id = @BusinessModuleId)
		ORDER BY BM.BusinessModuleName asc		
END