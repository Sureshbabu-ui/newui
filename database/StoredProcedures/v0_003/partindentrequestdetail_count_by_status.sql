CREATE OR ALTER PROCEDURE [dbo].[partindentrequestdetail_count_by_status]
@TotalRows INT OUTPUT,
@ReqStatus VARCHAR(8) = NULL
AS
BEGIN
    SELECT
        @TotalRows = COUNT(PIRD.Id)
    FROM 
        PartIndentRequestDetail PIRD
        INNER JOIN Part P ON P.Id = PIRD.PartId
        INNER JOIN PartCategory PC ON PC.Id = P.PartCategoryId
        INNER JOIN MasterEntityData PartRequestStatus ON PartRequestStatus.Id = PIRD.RequestStatusId
        INNER JOIN MasterEntityData StockType ON StockType.Id = PIRD.StockTypeId
		WHERE
	   (@ReqStatus IS NULL OR (PartRequestStatus.Code = @ReqStatus)) 
END;
