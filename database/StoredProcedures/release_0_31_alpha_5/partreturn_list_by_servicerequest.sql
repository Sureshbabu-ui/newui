
CREATE OR ALTER PROCEDURE [dbo].[partreturn_list_by_servicerequest]
	@ServiceRequestId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        PR.Id,
		PR.SerialNumber,
		PR.ReturnRemarks,
	    P.PartName,
		ReturnInitiatedBy.FullName AS ReturnInitiatedBy,
		TOF.OfficeName AS ReceivingLocation,
		ReturnedPartType.Name AS  ReturnedPartType
	FROM PartReturn  PR
	INNER JOIN Part  P ON P.Id=PR.PartId
	INNER JOIN UserInfo  ReturnInitiatedBy ON ReturnInitiatedBy.Id = PR.ReturnInitiatedBy
	INNER JOIN MasterEntityData  ReturnedPartType ON ReturnedPArtType.Id = PR.ReturnedPartTypeId
	INNER JOIN TenantOffice TOF ON TOF.Id=PR.ReceivingLocationId
	WHERE 
		PR.ServiceRequestId = @ServiceRequestId
	
   ORDER BY 
		PR.Id Desc
END