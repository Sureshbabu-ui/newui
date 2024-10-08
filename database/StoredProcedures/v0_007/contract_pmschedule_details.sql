CREATE OR ALTER     PROCEDURE [dbo].[contract_pmschedule_details]
	@PmScheduleId INT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT
		CAPD.Id,
		CPS.PmScheduleNumber,
		A.ProductSerialNumber,
		CAPD.PmDate,
		PmEngineer.FullName AS PmEngineer,
		PmVendorBranch.Name AS PmVendorBranch,
		CAPD.PmNote
	FROM ContractAssetPmDetail CAPD WITH (NOLOCK)
		LEFT JOIN ContractPmSchedule CPS ON CPS.Id = CAPD.PmScheduleId
		LEFT JOIN ContractAssetDetail CAD ON CAD.Id = CAPD.ContractAssetDetailId
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		LEFT JOIN UserInfo PmEngineer ON PmEngineer.Id = CAPD.PmEngineerId
		LEFT JOIN VendorBranch PmVendorBranch ON PmVendorBranch.Id = CAPD.VendorBranchId
	WHERE
		CAPD.PmScheduleId = @PmScheduleId 
	ORDER BY
		CAPD.CreatedOn DESC
END 