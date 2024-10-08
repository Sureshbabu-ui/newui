﻿CREATE OR ALTER   PROCEDURE [dbo].[partindentdemand_cwh_attention_needed_list]
	@Page INT = 1,
	@PerPage INT = 10,
	@Search varchar(50) = NULL,
	@UserInfoId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;

	SELECT
        @UserCategory = MED.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        LEFT JOIN TenantOffice T ON T.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
    WHERE
        UserInfo.Id = @UserInfoId;

	IF @Page < 1
	SET @Page = 1;
    SELECT 
        PID.Id,
		PID.DemandNumber,
		PID.DemandDate,
		PID.PartIndentRequestNumber,
		PID.WorkOrderNumber,
		PID.Remarks,
		PID.Quantity,
		T.OfficeName AS TenantOfficeName,
		MED.[Name] AS UnitOfMeasurement,
		UI.FullName AS CreatedBy,
		Part.[Description] PartName,
		PID.PartId,
		PIR.RequestedBy AS RecipientUserId,
		Part.PartCode
	FROM
        PartIndentDemand PID
		LEFT JOIN TenantOffice T ON T.Id =PID.TenantOfficeId
		LEFT JOIN Part ON Part.Id = PID.PartId
		LEFT JOIN PartIndentRequest PIR ON PIR.IndentRequestNumber = PID.PartIndentRequestNumber
		LEFT JOIN MasterEntityData MED ON MED.Id = PID.UnitOfMeasurementId
		LEFT JOIN UserInfo UI ON UI.Id = PID.CreatedBy
        LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId = PID.Id
	WHERE
		(ISNULL(@Search, '') = '' OR 
		PID.DemandNumber LIKE '%' + @Search + '%') AND
        (
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = PID.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        ) AND
		PID.IsCwhAttentionNeeded = 1
    ORDER BY PID.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END