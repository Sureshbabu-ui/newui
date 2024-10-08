CREATE OR ALTER PROCEDURE [dbo].[pendingcall_report_download]
    @DateFrom VARCHAR(64) = NULL,
    @DateTo VARCHAR(64) = NULL,
    @TimeZone VARCHAR(64),
    @TenantRegionId INT = NULL,
    @TenantOfficeId INT = NULL,
	@UserId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
	DECLARE @UserOfficeId INT;
	DECLARE @UserRegionId INT;

	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = UserInfo.TenantOfficeId,
		@UserRegionId = TenantOffice.RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserId;

	IF @DateFrom IS NULL OR @DateTo = ''
    SET @DateFrom = CAST(DATEADD(DAY, -30, GETUTCDATE()) AS DATE); 
    IF @DateTo IS NULL OR @DateTo = ''
    SET @DateTo = CAST(GETUTCDATE() AS DATE);
	SET @DateTo = DATEADD(SECOND, -1, DATEADD(DAY, 1, @DateTo));

	SELECT
		TR.RegionName,
		T.Code AS [Location],
		SR.CaseId,
		SR.WorkOrderNumber,
		C.ContractNumber,
		CI.[Name] AS CustomerName,
		CS.SiteName AS CustomerSiteName,
		PC.CategoryName,
		M.[Name] AS Make,
		P.ModelName,
		A.ProductSerialNumber,
		FORMAT(CAST(SR.CreatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy HH:mm:ss') AS CreatedOn,
		FORMAT(CAST(SRA.CreatedOn AS datetime2) ,'dd-MM-yyyy HH:mm:ss') AS EngAssignDate,
		EngName.FullName AS EngName,
		CAT.[Name] AS AGType,
		Part.PartCode,
		Part.[Description] AS PartDesc,
		PIR.IndentRequestNumber,
		FORMAT(CAST(PIR.CreatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy') AS PartReqDate,
		PID.DemandNumber,
		FORMAT(CAST(PID.DemandDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy') AS DemandDate,
		FORMAT(CAST(DC.DcDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy') AS PartShippedDate,
		FORMAT(CAST(GIRN.AllocatedOn AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE @TimeZone,'dd-MM-yyyy') AS PartIssuedDate,
		PIEN.FullName AS PartIssuedEngName,
		CallStatus.[Name] AS CallStatus,
		DNS.[Name] AS Demandstatus,
		CAD.ResolutionTimeInHours,
		PID.Quantity AS NoOfPartsDemanded,
		SR.CallcenterRemarks,
		CASE 
			WHEN GIRN.ReceivedOn IS NOT NULL THEN PID.Quantity
			ELSE 0
		END AS NoOfPartsReceived,
		CASE 
			WHEN GIRN.GInNumber IS NOT NULL THEN PID.Quantity
			ELSE 0
		END AS NoOfPartsIssued,
		ET.[Name] AS Engtype,
		DATEDIFF(DAY, SR.WorkOrderCreatedOn, GETUTCDATE()) AS Ageing,
		(CASE 
			WHEN DATEDIFF(DAY, SR.WorkOrderCreatedOn, GETUTCDATE()) BETWEEN 0 AND 3 THEN '0-3 Days'
			WHEN DATEDIFF(DAY, SR.WorkOrderCreatedOn, GETUTCDATE()) BETWEEN 4 AND 7 THEN '>3-7 Days'
			WHEN DATEDIFF(DAY, SR.WorkOrderCreatedOn, GETUTCDATE()) BETWEEN 8 AND 15 THEN '>7-15 Days'
			WHEN DATEDIFF(DAY, SR.WorkOrderCreatedOn, GETUTCDATE()) BETWEEN 16 AND 30 THEN '>15-30 Days'
			WHEN DATEDIFF(DAY, SR.WorkOrderCreatedOn, GETUTCDATE()) > 30 THEN '> 30 Days'
		END) AS AgeGroup,
		(CASE 
			WHEN DATEDIFF(DAY, GIRN.GinDate, GETUTCDATE()) BETWEEN 0 AND 3 THEN '0-3 Days'
			WHEN DATEDIFF(DAY, GIRN.GinDate, GETUTCDATE()) BETWEEN 4 AND 7 THEN '4-7 Days'
			WHEN DATEDIFF(DAY, GIRN.GinDate, GETUTCDATE()) BETWEEN 8 AND 15 THEN '8-15 Days'
			WHEN DATEDIFF(DAY, GIRN.GinDate, GETUTCDATE()) BETWEEN 16 AND 30 THEN '16-30 Days'
			WHEN DATEDIFF(DAY, GIRN.GinDate, GETUTCDATE()) > 30 THEN '> 30 Days'
		END) AS PartIssueAgeGroup

	FROM ServiceRequest SR
		INNER JOIN Contract C ON C.Id = SR.ContractId
		INNER JOIN Customer CST ON C.CustomerId = CST.Id
		INNER JOIN CustomerInfo CI ON CI.CustomerId = CST.Id AND CI.EffectiveTo IS NULL
		INNER JOIN CustomerSite CS ON CS.Id = SR.CustomerSiteId
		INNER JOIN MasterEntityData CallStatus ON SR.CaseStatusId = CallStatus.Id
		LEFT JOIN ContractAssetDetail CAD ON CAD.Id=SR.ContractAssetId
		LEFT JOIN Asset A ON A.Id = CAD.AssetId 
		LEFT JOIN ServiceRequestAssignee SRA ON SRA.Id = SR.ServiceRequestAssignmentId
		LEFT JOIN UserInfo EngName ON EngName.Id= SRA.AssigneeId
		LEFT JOIN ServiceEngineerInfo SEI ON SEI.UserInfoId = EngName.Id
		LEFT JOIN MasterEntityData AS ET ON ET.Id = SEI.EngineerType
		INNER JOIN MasterEntityData AS CAT ON CAT.Id = C.AgreementTypeId
		LEFT JOIN PartIndentRequest AS PIR ON PIR.ServiceRequestId = SR.Id
		LEFT JOIN PartIndentRequestDetail AS PIRD ON PIRD.PartIndentRequestId = PIR.Id
		LEFT JOIN Part ON Part.Id = PIRD.PartId
		LEFT JOIN PartIndentDemand PID ON PID.PartIndentRequestDetailId = PIRD.Id
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId = PID.Id
		LEFT JOIN DeliveryChallan DC ON DC.Id = GIRN.DeliveryChallanId
		LEFT JOIN UserInfo PIEN ON PIEN.Id = GIRN.RecipientUserId
		LEFT JOIN MasterEntityData AS DNS ON DNS.Id = PID.DemantNoteStatusId
		INNER JOIN AssetProductCategory PC ON PC.Id = A.AssetProductCategoryId
		INNER JOIN Make M ON M.Id = A.ProductMakeId
		INNER JOIN Product P ON P.Id = A.ProductModelId
		INNER JOIN TenantOffice T ON T.Id = CS.TenantOfficeId
		INNER JOIN TenantRegion TR ON TR.TenantOfficeId = T.Id
	WHERE  
		CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD') 
		AND (CAST(SR.CreatedOn AS DATE) BETWEEN CAST(@DateFrom AS DATE) AND CAST(@DateTo AS DATE))
        AND (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId)
        AND (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId) 
		AND (
				@UserCategory = 'UCT_FRHO'
				OR (@UserCategory = 'UCT_CPTV' AND T.Id = @UserOfficeId)
				OR (@UserCategory = 'UCT_FRRO' AND T.RegionId = @UserRegionId)
		    )
	ORDER BY SR.CreatedOn DESC 		
END