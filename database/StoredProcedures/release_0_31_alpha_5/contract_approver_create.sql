CREATE OR ALTER   PROCEDURE [dbo].[contract_approver_create]
    @TenantOfficeId INT,
    @FirstApproverId INT,
    @SecondApproverId INT,
    @RenewalFirstApproverId INT,
    @RenewalSecondApproverId INT,
    @CreatedBy INT
AS 
BEGIN 
    SET NOCOUNT ON;
	INSERT INTO
        ContractApprovalFlow
                (TenantOfficeId,
                FirstApproverId,
                SecondApproverId,
			    RenewalFirstApproverId,
			    RenewalSecondApproverId,
                CreatedBy,
                CreatedOn)
	VALUES
                (@TenantOfficeId,
                @FirstApproverId,
				@SecondApproverId,
				@RenewalFirstApproverId,
				@RenewalSecondApproverId,
                @CreatedBy,
                GETUTCDATE())
END