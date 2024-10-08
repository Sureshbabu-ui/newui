CREATE OR ALTER PROCEDURE[dbo].[contract_update_status_expire] 
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @StatusId INT;

    SELECT @StatusId = Id 
    FROM MasterEntityData 
    WHERE Code = 'CTS_EXPR';

    UPDATE Contract
    SET ContractStatusId = @StatusId
    WHERE CallExpiryDate < GETUTCDATE() AND 
    ContractStatusId != @StatusId; 

END;
