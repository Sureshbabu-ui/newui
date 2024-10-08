CREATE OR ALTER PROCEDURE [dbo].[contract_approver_details]
    @TenantId INT,
    @IsRenewContract BIT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   
        FA.FullName AS FirstApprover,
		FA.EmployeeCode AS FirstApproverEmployeeCode,
        FA.Email AS FirstApproverEmail,
	    CASE WHEN (@IsRenewContract = 0) THEN CAF.FirstApproverId ELSE CAF.RenewalFirstApproverId END AS FirstApproverId,
        CAF.TenantOfficeId,
        FAD.[Name] AS FirstApproverDesignation,
        SA.FullName AS SecondApprover,
		SA.EmployeeCode AS SecondApproverEmployeeCode,
        SA.Email AS SecondApproverEmail,
	    CASE WHEN (@IsRenewContract = 0) THEN CAF.SecondApproverId ELSE CAF.RenewalSecondApproverId END AS SecondApproverId,
        SAD.[Name] AS SecondApproverDesignation,
        T.OfficeName AS [Location]
    FROM ContractApprovalFlow CAF
        JOIN TenantOffice T ON CAF.TenantOfficeId = T.Id 
        JOIN UserInfo FA ON 
        CASE WHEN (@IsRenewContract = 0) THEN CAF.FirstApproverId 
        ELSE CAF.RenewalFirstApproverId END = FA.Id 
        JOIN Designation FAD ON FA.DesignationId = FAD.Id
        JOIN UserInfo SA ON 
        CASE WHEN (@IsRenewContract = 0) THEN CAF.SecondApproverId 
        ELSE CAF.RenewalSecondApproverId END = SA.Id 
        JOIN Designation SAD ON SA.DesignationId = SAD.Id
    WHERE
        CAF.TenantOfficeId = @TenantId;
END