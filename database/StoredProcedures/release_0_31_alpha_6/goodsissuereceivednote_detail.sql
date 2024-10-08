CREATE OR ALTER PROCEDURE [dbo].[goodsissuereceivednote_detail]
    @PartIndentDemandId INT
AS
BEGIN
    SELECT 
		GIN.Id,
        GIN.GinDate,
		GIN.GinNumber,
		GIN.AllocatedOn,
		GIN.ReceivedOn,
		GIN.Remarks,
		GIN.DeliveryChallanId,
		RU.FullName AS RecipientUser,
		T.OfficeName AS TenantOffice
    FROM 
        PartIndentDemand PID
        LEFT JOIN GoodsIssuedReceivedNote GIN ON GIN.PartIndentDemandId = PID.Id
        LEFT JOIN TenantOffice T ON T.Id = GIN.TenantOfficeId
		LEFT JOIN UserInfo RU ON RU.Id = GIN.RecipientUserId
    WHERE 
        PID.Id = @PartIndentDemandId
END