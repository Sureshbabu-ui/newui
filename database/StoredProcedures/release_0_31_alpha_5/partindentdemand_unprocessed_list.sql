CREATE OR ALTER  PROCEDURE [dbo].[partindentdemand_unprocessed_list]
AS
BEGIN 
	SET NOCOUNT ON;
    SELECT 
        PID.Id,
		PID.DemandNumber,
		TOI.[Address] AS DemandAddress
	FROM
        PartIndentDemand PID
		LEFT JOIN GoodsIssuedReceivedNote GIRN ON GIRN.PartIndentDemandId = PID.Id
		LEFT JOIN TenantOfficeInfo TOI ON TOI.TenantOfficeId = PID.TenantOfficeId
	WHERE GIRN.GinNumber IS NULL 
    ORDER BY PID.Id;
END

