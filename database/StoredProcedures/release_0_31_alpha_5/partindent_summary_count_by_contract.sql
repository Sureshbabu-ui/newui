CREATE OR ALTER PROCEDURE [dbo].[partindent_summary_count_by_contract]
    @ContractId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @TotalPartIndentCount INT;
    DECLARE @PendingPartIndentCount INT;
    DECLARE @RejectedPartIndentCount INT;
    DECLARE @ApprovedPartIndentCount INT;

    SELECT
        @TotalPartIndentCount = ISNULL(SUM(Quantity), 0),
        @PendingPartIndentCount = ISNULL(SUM(CASE WHEN PartRequestStatus.Code = 'PRT_CRTD' THEN Quantity ELSE 0 END), 0),
        @RejectedPartIndentCount = ISNULL(SUM(CASE WHEN PartRequestStatus.Code = 'PRT_RJTD' THEN Quantity ELSE 0 END), 0),
        @ApprovedPartIndentCount = ISNULL(SUM(CASE WHEN PartRequestStatus.Code IN ('PRT_APRV', 'PRT_DESP', 'PRT_HOLD', 'PRT_TRNS', 'PRT_RCVD') THEN Quantity ELSE 0 END), 0)
    FROM
        PartIndentRequestDetail
        LEFT JOIN PartIndentRequest ON PartIndentRequest.Id = PartIndentRequestDetail.PartIndentRequestId
        LEFT JOIN ServiceRequest ON ServiceRequest.Id = PartIndentRequest.ServiceRequestId
        LEFT JOIN [Contract] ON [Contract].Id = ServiceRequest.ContractId
        INNER JOIN MasterEntityData AS PartRequestStatus ON PartRequestStatus.Id = PartIndentRequestDetail.RequestStatusId
    WHERE
        Contract.Id = @ContractId;

    SELECT
        @ApprovedPartIndentCount AS ApprovedPartIndentCount,
        @RejectedPartIndentCount AS RejectedPartIndentCount,
        @TotalPartIndentCount AS TotalPartIndentCount,
        @PendingPartIndentCount AS PendingPartIndentCount;
END
