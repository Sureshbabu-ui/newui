CREATE OR ALTER PROCEDURE [dbo].[partreturn_locationwise_count] 
	@Search VARCHAR(50) = NULL,
	@UserInfoId INT,
	@TotalRows VARCHAR(10) OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SET NOCOUNT ON;
	
	DECLARE @TenantOfficeId INT =(SELECT TenantOfficeId FROM UserInfo WHERE UserInfo.Id = @UserInfoId);

	SELECT 
		@TotalRows = COUNT(PR.Id)
	FROM PartReturn PR
		LEFT JOIN Part ON PART.Id = PR.PartId
	WHERE
		(ISNULL(@Search, '') = '' OR 
		Part.[Description] LIKE '%' + @Search + '%' OR 
		PR.SerialNumber LIKE '%' + @Search + '%') AND
		PR.ReceivingLocationId = @TenantOfficeId AND
		PR.ReceivedOn IS NULL
END