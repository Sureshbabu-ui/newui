CREATE OR ALTER    PROCEDURE [dbo].[partindentrequest_selected_detail_for_sme]
	@PartIndentRequestId INT
AS
BEGIN
	SELECT
		PIR.Id,
		SR.WorkOrderNumber,
		CallStatus.[Name] As CallStatus,
		SR.CallcenterRemarks,
		SR.CustomerReportedIssue,
		A.ProductSerialNumber,
		M.[Name] AS Make,
		APC.CategoryName,
		P.ModelName,
		T.OfficeName AS [Location],
		PIR.IndentRequestNumber,
		UI.FullName AS RequestedBy,
		PIR.CreatedOn,
		PIR.Remarks,
		APC.Id AS AssetProductCategoryId,
		SR.ContractId,
		SR.Id AS ServiceRequestId,
		CAST(
			CASE 
				WHEN A.WarrantyEndDate > GETDATE() THEN 1 
				ELSE 0 
			END AS BIT
		) AS IsWarranty,
		UserInfo.FullName AS ReviewedBy,
		PIRD.ReviewedOn,
		PIRD.ReviewerComments
	FROM 
        PartIndentRequest PIR
		INNER JOIN PartIndentRequestDetail PIRD ON PIRD.PartIndentRequestId = PIR.Id
		LEFT JOIN UserInfo ON UserInfo.Id = PIRD.ReviewedBy
		INNER JOIN ServiceRequest SR ON SR.Id = PIR.ServiceRequestId
		INNER JOIN MasterEntityData CallStatus ON CallStatus.Id = SR.CaseStatusId
		INNER JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
		INNER JOIN Asset A ON A.Id = CAD.AssetId 
		INNER JOIN TenantOffice T ON T.Id = PIR.TenantOfficeId
		LEFT JOIN UserInfo UI ON UI.Id = PIR.RequestedBy
		LEFT JOIN Make M ON M.Id = A.ProductMakeId
		LEFT JOIN AssetProductCategory APC ON APC.Id = A.AssetProductCategoryId
		LEFT JOIN Product P ON P.Id = A.ProductModelId
WHERE 
		PIR.Id = @PartIndentRequestId	
END