CREATE
OR ALTER PROCEDURE [dbo].[partreturn_locationwise_list] @Page INT = 1,
@PerPage INT = 10,
@Search varchar(50) = NULL,
@UserInfoId INT AS BEGIN
SET
	NOCOUNT ON;

DECLARE @TenantOfficeId INT;

SELECT
	@TenantOfficeId = TenantOfficeId
FROM
	UserInfo
WHERE
	UserInfo.Id = @UserInfoId;

IF @Page < 1
SET
	@Page = 1;

SELECT
	PR.Id,
	SR.WorkOrderNumber,
	(
		CASE
			WHEN PR.PartStockId IS NOT NULL THEN PS.SerialNumber
			ELSE PR.SerialNumber
		END
	) AS SerialNumber,
	Part.PartName,
	Part.[Description] PartName,
	MED.[Name] AS ReturnedPartType,
	PR.ReturnInitiatedOn,
	UI.FullName AS ReturnInitiatedBy,
	RL.OfficeName AS ReceivingLocation,
	PR.ReceivingLocationId
FROM
	PartReturn PR
	LEFT JOIN PartStock PS ON PS.Id = PR.PartStockId
	LEFT JOIN ServiceRequest SR ON SR.Id = PR.ServiceRequestId
	LEFT JOIN Part ON PART.Id = PR.PartId
	LEFT JOIN MasterEntityData MED ON MED.Id = PR.ReturnedPartTypeId
	LEFT JOIN UserInfo UI ON UI.Id = PR.ReturnInitiatedBy
	LEFT JOIN TenantOffice RL ON RL.Id = PR.ReceivingLocationId
WHERE
	(
		ISNULL(@Search, '') = ''
		OR Part.[Description] LIKE '%' + @Search + '%'
		OR PR.SerialNumber LIKE '%' + @Search + '%'
	)
	AND PR.ReceivingLocationId = @TenantOfficeId
	AND PR.ReceivedOn IS NULL
ORDER BY
	PR.ReturnInitiatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;

END