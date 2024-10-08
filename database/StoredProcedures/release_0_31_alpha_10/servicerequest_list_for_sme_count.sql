
CREATE OR ALTER   PROCEDURE [dbo].[servicerequest_list_for_sme_count]
    @Search     VARCHAR(50) = NULL,
    @SearchWith VARCHAR(50) = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
	SELECT 
		@TotalRows = COUNT(SR.Id)
	FROM 
		ServiceRequest AS SR
			LEFT JOIN Contract ON Contract.Id = SR.ContractId
			LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId 
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			LEFT JOIN Asset A ON A.Id = CAD.AssetId
			LEFT JOIN ContractInterimAsset AS InterimAsset ON InterimAsset.Id = SR.ContractInterimAssetId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
			LEFT JOIN Product ON Product.Id = COALESCE(A.ProductModelId, InterimAsset.ProductModelId)
			LEFT JOIN AssetProductCategory AS PC ON PC.Id = COALESCE(A.AssetProductCategoryId, InterimAsset.AssetProductCategoryId)
			LEFT JOIN UserInfo AS UI ON UI.Id = SR.CreatedBy
	WHERE 
			((@SearchWith IS NULL OR @SearchWith = '') OR 
			( @SearchWith = 'WorkOrderNumber' AND SR.WorkOrderNumber LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'SerialNumber' AND A.ProductSerialNumber LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'SerialNumber' AND InterimAsset.ProductSerialNumber LIKE '%' +@Search+ '%')OR
			( @SearchWith = 'EndUserPhone' AND SR.EndUserPhone LIKE '%' +@Search+ '%')) 
END
