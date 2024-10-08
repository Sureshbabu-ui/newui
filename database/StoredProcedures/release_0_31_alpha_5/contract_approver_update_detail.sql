CREATE OR ALTER PROCEDURE [dbo].[contract_approver_update_detail]
	@ApprovalFlowId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        Id ApprovalFlowId,	
		TenantOfficeId,
		FirstApproverId,
		SecondApproverId,
		RenewalFirstApproverId,
		RenewalSecondApproverId
    FROM ContractApprovalFlow
	WHERE
		Id =@ApprovalFlowId
END