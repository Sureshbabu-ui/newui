CREATE OR ALTER PROCEDURE [dbo].[contract_approver_update]
    @ApprovalFlowId INT,
    @UpdatedBy INT,
    @TenantOfficeId INT,
    @FirstApproverId INT,
    @SecondApproverId INT,
    @RenewalFirstApproverId INT,
    @RenewalSecondApproverId INT
AS 
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION

    UPDATE ContractApprovalFlow 
    SET
        TenantOfficeId = @TenantOfficeId,
        FirstApproverId = @FirstApproverId,
        SecondApproverId = @SecondApproverId,
        RenewalFirstApproverId = @RenewalFirstApproverId,
        RenewalSecondApproverId = @RenewalSecondApproverId,
        ModifiedOn = GETUTCDATE(),
        ModifiedBy = @UpdatedBy
    WHERE
        Id = @ApprovalFlowId;
		
    UPDATE Contract
    SET
        SecondApproverId = 
            CASE 
                WHEN Contract.TenantOfficeId = @TenantOfficeId 
                     AND (Contract.SecondApprovedOn IS NULL AND FirstApprovedOn IS NOT NULL )
                     AND MED.Code = 'CTS_PNDG'
                     AND Contract.OldContractId IS NULL
                THEN @SecondApproverId
                WHEN Contract.OldContractId IS NOT NULL AND (Contract.SecondApprovedOn IS NULL AND FirstApprovedOn IS NOT NULL )
                THEN @RenewalSecondApproverId
                ELSE SecondApproverId
            END,
        FirstApproverId = 
            CASE 
                WHEN Contract.TenantOfficeId = @TenantOfficeId 
                     AND FirstApprovedOn IS NULL 
                     AND MED.Code = 'CTS_PNDG'
                     AND Contract.OldContractId IS NULL
                THEN @FirstApproverId
                WHEN Contract.OldContractId IS NOT NULL AND FirstApprovedOn IS NULL 
                THEN @RenewalFirstApproverId
                ELSE FirstApproverId
            END
    FROM Contract
    INNER JOIN MasterEntityData MED ON MED.Id = Contract.ContractStatusId
    WHERE
        Contract.TenantOfficeId = @TenantOfficeId
        AND (Contract.SecondApprovedOn IS NULL OR FirstApprovedOn IS NULL)
        AND (Contract.OldContractId IS NULL OR Contract.OldContractId IS NOT NULL)
        AND MED.Code = 'CTS_PNDG';

    COMMIT TRANSACTION;
END