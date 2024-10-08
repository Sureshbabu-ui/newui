CREATE OR ALTER  PROCEDURE [dbo].[contractasset_exist_check]
	@SearchValue VARCHAR(50),
	@SearchType VARCHAR(50)
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @InterimAssetStatusId INT;
	DECLARE @ContractStatus INT;
	DECLARE @CallStatusClosed INT;
	DECLARE @CallStatusRemotelyClosed INT;
	SELECT @ContractStatus = Id FROM MasterEntityData WHERE Code = 'CTS_APRV'
	SELECT @CallStatusClosed = Id FROM MasterEntityData WHERE Code = 'SRS_CLSD'
	SELECT @CallStatusRemotelyClosed = Id FROM MasterEntityData WHERE Code = 'SRS_RCLD'

	-- Check if the asset exists in ContractAssetDetail
	IF EXISTS (
		SELECT 1
		FROM ContractAssetDetail CAD
		INNER JOIN Asset ON Asset.Id = CAD.AssetId
		INNER JOIN Contract AS C ON C.Id = CAD.ContractId
		WHERE ((@SearchType = 'MspAssetId' AND Asset.MspAssetId = @SearchValue) OR
		   (@SearchType = 'ProductSerialNumber' AND Asset.ProductSerialNumber = @SearchValue)) AND
		   C.ContractStatusId = @ContractStatus AND CAD.IsActive = 1
	)
	BEGIN
		-- If the asset exists, select the Id and set IsRegularAssetExist as true
		SELECT 
			CAD.Id AS AssetId,
			1 AS IsRegularAssetExist,
			SR.WorkOrderNumber,
		CASE 
			WHEN SR.Id IS NULL THEN 0
			ELSE 1
		END AS IsCallOpen
		FROM ContractAssetDetail CAD
		INNER JOIN Asset ON Asset.Id = CAD.AssetId
		LEFT JOIN ServiceRequest AS SR ON SR.ContractAssetId = CAD.Id AND SR.CaseStatusId NOT IN (@CallStatusClosed, @CallStatusRemotelyClosed)
		WHERE (@SearchType = 'MspAssetId' AND Asset.MspAssetId = @SearchValue)
		   OR (@SearchType = 'ProductSerialNumber' AND Asset.ProductSerialNumber = @SearchValue);
	END
	ELSE
	BEGIN
		-- If the asset does not exist in ContractAssetDetail, check in ContractInterimAsset
		SELECT @InterimAssetStatusId = Id FROM MasterEntityData WHERE Code = 'IAS_APRV'

		SELECT 
			CASE 
				WHEN (@SearchType = 'ProductSerialNumber' AND ProductSerialNumber = @SearchValue) THEN 1 
				ELSE 0 
			END AS IsInterimAssetExist
		FROM 
			ContractInterimAsset
		WHERE
			(@SearchType = 'ProductSerialNumber' AND ProductSerialNumber = @SearchValue) AND
			InterimAssetStatusId != @InterimAssetStatusId;
	END;
END