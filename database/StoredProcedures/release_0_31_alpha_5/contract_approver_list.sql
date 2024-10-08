CREATE OR ALTER PROCEDURE [dbo].[contract_approver_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    
    DECLARE @TenantOfficeTypeId INT
    SELECT @TenantOfficeTypeId = Id FROM MasterEntityData WHERE Code = 'TOT_AROF'
    
    IF @Page < 1
        SET @Page = 1;

    SELECT
        TenantOffice.Id,
        CAF.Id AS ApprovalFlowId,
        FA.FullName AS FirstApprover,
        SA.FullName AS SecondApprover,
        RFA.FullName AS RenewalFirstApprover,
        RSA.FullName AS RenewalSecondApprover,
        TenantOffice.OfficeName AS AccelLocation
    FROM TenantOffice
    LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = TenantOffice.Id
    LEFT JOIN ContractApprovalFlow CAF ON CAF.TenantOfficeId = TenantOffice.Id
    LEFT JOIN UserInfo FA ON FA.Id = CAF.FirstApproverId
    LEFT JOIN UserInfo SA ON SA.Id = CAF.SecondApproverId
    LEFT JOIN UserInfo RFA ON RFA.Id = CAF.RenewalFirstApproverId
    LEFT JOIN UserInfo RSA ON RSA.Id = CAF.RenewalSecondApproverId
    WHERE
        TOI.IsVerified = 1 AND 
        TOI.EffectiveTo IS NULL AND 
        TenantOffice.OfficeTypeId = @TenantOfficeTypeId AND
        (@Search IS NULL OR 
        TenantOffice.OfficeName LIKE '%' + @Search + '%')
    ORDER BY
        TOI.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END
