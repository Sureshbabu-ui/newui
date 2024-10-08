CREATE OR ALTER PROCEDURE [dbo].[partindentrequestdetail_for_review]
	@Id	INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		PIRD.PartId,
		PIRD.Quantity,
		PIR.IndentRequestNumber,
		PIR.TenantOfficeId,
		SR.WorkOrderNumber
    FROM PartIndentRequestDetail PIRD
		INNER JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
		INNER JOIN ServiceRequest SR ON SR.Id = PIR.ServiceRequestId
    WHERE
       PIRD.Id = @Id 
END