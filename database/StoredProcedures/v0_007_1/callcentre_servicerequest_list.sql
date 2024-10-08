 CREATE OR ALTER     PROCEDURE [dbo].[callcentre_servicerequest_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @Search      VARCHAR(50) = NULL,
    @SearchWith  VARCHAR(50) = NULL,
    @filterWith  VARCHAR(16) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
    SET @Page = 1;
		SELECT 
			SR.Id,
			SR.CaseId,
			SR.WorkOrderNumber,
			Contract.ContractNumber,
			CallStatus.[Name] AS Status,
			CallStatus.Code AS StatusCode,
			Product.ModelName,
			PC.CategoryName,
			COALESCE(A.ProductSerialNumber, InterimAsset.ProductSerialNumber) AS ProductSerialNumber,
			CustomerInfo.[Name] AS CustomerName,
			SR.CustomerServiceAddress,
			SR.EndUserPhone,
			SR.CustomerReportedIssue,
			SR.CallcenterRemarks,
			UI.FullName AS CreatedBy,
			CAD.ResolutionTimeInHours,
			SR.WorkOrderCreatedOn,
			SR.TicketNumber
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
			( @SearchWith = 'CaseId' AND SR.CaseId LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'SerialNumber' AND A.ProductSerialNumber LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'SerialNumber' AND InterimAsset.ProductSerialNumber LIKE '%' +@Search+ '%')OR
			( @SearchWith = 'EndUserPhone' AND SR.EndUserPhone LIKE '%' +@Search+ '%')) AND
			(
				(@filterWith = 'CLSD' AND CallStatus.Code = 'SRS_CLSD')
				OR
				(@filterWith = 'RGLR' AND (SR.IsInterimCaseId = 0 OR SR.IsInterimCaseId IS NULL) AND CallStatus.Code != 'SRS_CLSD')
				OR
				(@filterWith = 'INTRM' AND SR.IsInterimCaseId = 1 AND CallStatus.Code != 'SRS_CLSD')
				OR
				(@filterWith IS NULL OR @filterWith = '')
			)	
			ORDER BY 
				SR.Id DESC 
			OFFSET 
				(@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
