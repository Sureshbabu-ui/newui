CREATE OR ALTER PROCEDURE [dbo].[contract_assets_serial_number_check]
	 @ContractId INT
 AS
 BEGIN 
	 SET NOCOUNT ON;
	 SELECT 
		A.ProductSerialNumber,
		CAD.Id
	 FROM ContractAssetDetail CAD
	 LEFT JOIN Asset A ON A.Id = CAD.AssetId
	 WHERE 
		CAD.ContractId = @ContractId AND CAD.IsActive = 1
END 