CREATE OR ALTER PROCEDURE [dbo].[contractcustomersite_activesite_exist_check]
	@CustomerSiteId INT,
	@IsSiteExist INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @ContractStatusId INT;
	SELECT @ContractStatusId = Id FROM MasterEntityData WHERE Code = 'CTS_APRV'
	IF( 0 = (SELECT Count(ContractCustomerSite.Id) 
			FROM ContractCustomerSite 
			LEFT JOIN [Contract] ON [Contract].Id = ContractCustomerSite.ContractId 
			WHERE 
				ContractCustomerSite.CustomerSiteId=@CustomerSiteId AND
				[Contract].ContractStatusId = @ContractStatusId AND
				[Contract].EndDate >= @CurrentDate AND
				[Contract].CallStopDate IS NULL))
        SET @IsSiteExist = 0
    ELSE
        SET @IsSiteExist = 1
END