﻿CREATE OR ALTER PROCEDURE [dbo].[partindentdemand_cwh_attention_not_needed_count] 
	@Search VARCHAR(50) = NULL,
	@UserInfoId INT,
	@IsCompleted BIT,
	@TotalRows VARCHAR(10) OUTPUT
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
		LEFT JOIN MasterEntityData MED ON UserInfo.UserCategoryId = MED.Id
	WHERE
		UserInfo.Id = @UserInfoId;

	SELECT 
		@TotalRows = COUNT(PID.Id)
	FROM PartIndentDemand PID
		LEFT JOIN TenantOffice T ON T.Id =PID.TenantOfficeId
		LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId = PID.Id
	WHERE
		(@UserCategory = 'UCT_FRHO' OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = PID.TenantOfficeId) OR
		(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)) AND	
        (ISNULL(@Search, '') = '' OR PID.DemandNumber LIKE '%' + @Search + '%') AND
		PID.IsCwhAttentionNeeded = 0 AND
		(@IsCompleted = 1 AND GIRN.GinNumber IS NOT NULL OR @IsCompleted = 0 AND GIRN.GinNumber IS NULL)
END