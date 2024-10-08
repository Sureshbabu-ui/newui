CREATE OR ALTER PROCEDURE [dbo].[contract_approver_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(TenantOffice.Id)
    FROM TenantOffice
    LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = TenantOffice.Id
    INNER JOIN MasterEntityData OT ON OT.Id = TenantOffice.OfficeTypeId
    WHERE 
        TOI.IsVerified = 1 AND 
        TOI.EffectiveTo IS NULL AND 
        OT.Code = 'TOT_AROF' AND
        (@Search IS NULL OR TenantOffice.OfficeName LIKE '%' + @Search + '%');
END
