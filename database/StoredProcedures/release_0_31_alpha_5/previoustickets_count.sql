CREATE OR ALTER PROCEDURE [dbo].[previoustickets_count]
    @AssetId INT = NULL,
    @ServiceRequestId INT = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id) 
    FROM ServiceRequest 
	WHERE 
		ContractAssetId = @AssetId AND
        (@ServiceRequestId IS NULL OR 
		Id != @ServiceRequestId)
END