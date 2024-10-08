using database.Models;
using Microsoft.VisualBasic;

namespace database.Seeder.Staging
{
    public class ServiceRequestSeeder
    {
        public IEnumerable<ServiceRequest> GetData()
        {
            return new List<ServiceRequest>
            {
                new ServiceRequest
                 {
                        Id = 1,
                        CaseId = "CST230903451",
                        ContractId = 1,
                        IncidentId=null,
                        IsInterimCaseId = false,
                        CallTypeId=85,
                        WorkOrderNumber="AMC/MAS/23/01940",
                        WorkOrderCreatedOn=DateTime.Parse("2023-09-13 15:32:00"),
                        CaseStatusId = 91,
                        CustomerReportedIssue = "Motherboard Issue",
                        Diagnosis=null,
                        MspProvidedSolution=null,
                        CaseReportedCustomerEmployeeName = "VINAY SINGHAL",
                        CaseReportedOn = DateTime.Parse("2023-04-06 15:32:00"),
                        OptedForRemoteSupport=false,
                        RemoteSupportNotOptedReason=null,
                        CustomerInfoId=3,
                        CustomerSiteId=2,
                        ContractAssetId=1,
                        CustomerContactTypeId=1,
                        EndUserName="MANSI SANGHVI",
                        EndUserPhone="8547962358",
                        EndUserEmail="mansisanghvi@gmail.com",
                        CallSourceId=87,
                        CallcenterRemarks= null,
                        ClosureRemarks=null,
                        ResolvedOn=null,
                        ResolvedBy=null,
                        HoursSpent=null,
                        ClosedBy=6,
                        ClosedOn=DateTime.Parse("2023-10-20 10:32:00"),
                        RepairReason=null,
                        IsDeleted=false,
                        CreatedBy=10,
                        CreatedOn=DateTime.Parse("2023-04-06 15:32:00"),
                        DeletedBy=null,
                        DeletedOn = null
                 },
                 new ServiceRequest
                 {
                        Id = 2,
                        CaseId = "CST230903562",
                        ContractId = 1,
                        IncidentId=null,
                        IsInterimCaseId = false,
                        CallTypeId=85,
                        WorkOrderNumber="AMC/BLR/23/04426",
                        WorkOrderCreatedOn=DateTime.Parse("2023-04-06 15:32:00"),
                        CaseStatusId = 91,
                        CustomerReportedIssue = "Misaligned – Weird-Looking Text.",
                        Diagnosis=null,
                        MspProvidedSolution=null,
                        CaseReportedCustomerEmployeeName = "SANJAY S SHAH",
                        CaseReportedOn = DateTime.Parse("2023-04-06 15:32:00"),
                        OptedForRemoteSupport=true,
                        RemoteSupportNotOptedReason=null,
                        CustomerInfoId=6,
                        CustomerSiteId=5,
                        ContractAssetId=2,
                        CustomerContactTypeId=1,
                        EndUserName="PRAMOD KUMAR",
                        EndUserPhone="7845956585",
                        EndUserEmail="pramodk@gmail.com",
                        CallSourceId=87,
                        CallcenterRemarks= null,
                        ClosureRemarks=null,
                        ResolvedOn=null,
                        ResolvedBy=null,
                        HoursSpent=null,
                        ClosedBy=8,
                        ClosedOn=DateTime.Parse("2023-11-20 11:32:00"),
                        RepairReason=null,
                        IsDeleted=false,
                        CreatedBy=10,
                        CreatedOn=DateTime.Parse("2023-04-06 15:32:00"),
                        DeletedBy=null,
                        DeletedOn = null
                 }
            };
        }
    }
}
