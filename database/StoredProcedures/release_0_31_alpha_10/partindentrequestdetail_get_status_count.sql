CREATE OR ALTER PROCEDURE [dbo].[partindentrequestdetail_get_status_count]
AS
BEGIN
    SELECT
	 COUNT(CASE WHEN MED.Code = 'PRT_CRTD' THEN PIRD.Id END) AS New,
	 COUNT(CASE WHEN MED.Code = 'PRT_HOLD' THEN PIRD.Id END) AS Hold,
	 COUNT(CASE WHEN MED.Code = 'PRT_APRV' THEN PIRD.Id END) AS Approved,
	  COUNT(CASE WHEN MED.Code = 'PRT_RJTD' THEN PIRD.Id END) AS Rejected
    FROM 
        PartIndentRequestDetail PIRD
        LEFT JOIN MasterEntityData MED ON MED.Id = PIRD.RequestStatusId
END;