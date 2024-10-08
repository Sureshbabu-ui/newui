CREATE OR ALTER PROCEDURE [dbo].[partindentrequest_previous_installation_list]
    @ServiceRequestId   INT,
	@PartCategoryIdList NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON; 
	DECLARE @ContractAssetId INT;
	SET @ContractAssetId = (SELECT ContractAssetId FROM ServiceRequest WHERE Id = @ServiceRequestId);

    SELECT 
	    PS.SerialNumber,
		PS.PartWarrantyExpiryDate,
		MED.[Name] AS StockType,
		PIN.InstalledOn
    FROM PartInstallation PIN
	    LEFT JOIN ServiceRequest SR ON SR.Id = PIN.ServiceRequestId
		LEFT JOIN PartStock PS ON PS.Id = PIN.PartStockId
		LEFT JOIN Part ON Part.Id = PS.PartId
		LEFT JOIN MasterEntityData MED ON MED.Id = PS.StockTypeId
	WHERE SR.ContractAssetId = @ContractAssetId AND
		Part.PartCategoryId IN (SELECT value FROM STRING_SPLIT(@PartCategoryIdList, ','))
	ORDER BY PIN.InstalledOn DESC
END