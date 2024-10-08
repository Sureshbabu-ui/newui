CREATE OR ALTER PROCEDURE [dbo].[contract_servicerequest_count] 
    @ContractId INT,
    @Open VARCHAR(10) OUTPUT,
    @Closed VARCHAR(10) OUTPUT,
    @TotalCount VARCHAR(10) OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    DECLARE @CaseStatus1Id INT;
    DECLARE @CaseStatus2Id INT;
    SELECT @CaseStatus1Id = Id FROM MasterEntityData WHERE Code = 'SRS_DRFT'
    SELECT @CaseStatus2Id = Id FROM MasterEntityData WHERE Code = 'SRS_CLSD'

    SELECT
        @Open = SUM(CASE WHEN SR.CaseStatusId = @CaseStatus1Id THEN 1 ELSE 0 END),
        @Closed = SUM(CASE WHEN SR.CaseStatusId = @CaseStatus2Id THEN 1 ELSE 0 END),
        @TotalCount = CAST(@Open AS INT) + CAST(@Closed AS INT)
    FROM ServiceRequest SR
    LEFT JOIN [Contract] ON [Contract].Id = SR.ContractId
    WHERE
        SR.ContractId = @ContractId
END