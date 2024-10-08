CREATE OR ALTER   PROCEDURE [dbo].[partindentrequestdetail_list_by_status]
    @Page INT=1,
    @PerPage INT=10,
	@ReqStatus VARCHAR(8) = NULL
AS
BEGIN
SET NOCOUNT ON;
	    IF @Page < 1
		SET @Page = 1;
   SELECT
		PIR.Id AS PartIndentRequestId,
		PIRD.Id AS PartIndentRequestDetailId,
		PIRD.IsWarrantyReplacement,
        P.PartCode,
        P.[Description] PartName,
        P.HsnCode,
		StockType.Id AS StockTypeId,
		StockType.[Name] AS StockType,
		PIRD.Quantity,
        PC.[Name] AS PartCategoryName,
		PartRequestStatus.[Name] AS PartRequestStatus,
		PartRequestStatus.Code AS PartRequestStatusCode,
		PIRD.ReviewerComments,
		PIR.IndentRequestNumber
FROM 
        PartIndentRequestDetail PIRD
		INNER JOIN Part P ON P.Id=PIRD.PartId
		INNER JOIN PartCategory PC ON PC.Id = P.PartCategoryId
		INNER JOIN MasterEntityData PartRequestStatus ON PartRequestStatus.Id = PIRD.RequestStatusId
		INNER JOIN MasterEntityData StockType ON StockType.Id = PIRD.StockTypeId
		INNER JOIN PartIndentRequest PIR ON PIR.Id = PIRD.PartIndentRequestId
	WHERE
	   (@ReqStatus IS NULL OR (PartRequestStatus.Code = @ReqStatus)) 
		ORDER BY PIRD.Id DESC 
        OFFSET (@Page-1)*@PerPage ROWS FETCH NEXT  @PerPage ROWS ONLY
END;
