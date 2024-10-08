CREATE OR ALTER PROCEDURE [dbo].[contractinvoiceschedule_list]
    @ContractId INT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        CIS.Id,
        CIS.ScheduleNumber,
        CIS.StartDate,
        CIS.EndDate,
        CIS.RrPerDay,
        CIS.TotalRrValue,
        CIS.ScheduledInvoiceDate,
        CIS.ScheduledInvoiceAmount,
        CI.Id AS ContractInvoiceId,
        CIS.IsInvoiceApproved
    FROM ContractInvoiceSchedule CIS
    LEFT JOIN ContractInvoice CI ON CI.ContractInvoiceScheduleId=CIS.Id
    WHERE  
        CIS.ContractId = @ContractId
    ORDER BY CIS.Id ASC 
END 