using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ServiceRequest
    {
        public int? Id { get; set; }      
        public string? CaseId { get; set; }           
        public string? WorkOrderNumber { get; set; }
        public string? CustomerName { get; set; }   
        public int? ContractId { get; set; }
        public string? ContractNumber { get; set; }
        public string? MspAssetId { get; set; }
        public string? ModelName { get; set; }
        public string? CategoryName { get; set; }
        public string? EndUserPhone { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string? Status { get; set; }
        public string? SiteName { get; set; }
        public int? ContractAssetId { get; set; }
        public DateTime? CaseReportedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public double ResolutionTimeInHours { get; set; }
        public string StatusCode { get; set; }
    }

    public class ServiceRequestDetails
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string CaseId { get; set; }
        public int ProductCategoryId { get; set; }
        public string? CustomerInfoId { get; set; }
        public int ContractId { get; set; }
        public bool IsInterimCaseId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? WorkOrderNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime WorkOrderCreatedOn { get; set; }
        public int CaseStatusId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string CustomerReportedIssue { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? Diagnosis { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? MspProvidedSolution { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CaseReportedCustomerEmployeeName { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CaseReportedOn { get; set; }
        public int? CustomerSiteId { get; set; }
        public int ContractAssetId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CustomerContactName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string CustomerContactPhone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CustomerContactEmail { get; set; }
        public int CallSourceId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? CallcenterRemarks { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? ClosureRemarks { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ResolvedOn { get; set; }
        public int? ResolvedBy { get; set; }
        public int? ClosedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ClosedOn { get; set; }
        public bool? IsDeleted { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CreatedByFullName{ get; set; }
        public string CaseStatusCode { get; set; }
    }

    public class ServiceRequestCreate
    {
        public int ContractId { get; set; }
        public int TenantOfficeId { get; set; }
        public string? IncidentId { get; set; }
        public string? TicketNumber { get; set; }
        public bool IsInterimCaseId { get; set; }
        public bool IsPreAmcApproval { get; set; }
        public bool IsFinanceApproval { get; set; }
        public int CallStatusId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string CustomerReportedIssue { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CaseReportedCustomerEmployeeName { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CaseReportedOn { get; set; }
        public int? CustomerInfoId { get; set; }
        public int CustomerSiteId { get; set; }
        public int? ContractAssetId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? EndUserName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? EndUserPhone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? EndUserEmail { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? CustomerContactEmail { get; set; }
        public string? RepairReason { get; set; }
        public int CallSourceId { get; set; }
        public int CallTypeId { get; set; }
        public int CustomerContactTypeId { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductModelNumber { get; set; }
        public int ProductMakeId { get; set; }
        public string? MspAssetId { get; set; }
        public string? ProductSerialNumber { get; set; }
        public Boolean OptedForRemoteSupport { get; set; }
        public int? RemoteSupportNotOptedReason { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? CallCenterRemarks { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? CustomerServiceAddress { get; set; }
        public int? HoursSpent { get; set; }
        public string? ClosureRemarks { get; set; }
        public bool RemotelyClose { get; set; }
        public bool IsAssetExist {  get; set; }
        public int? CallSeverityLevelId {  get; set; }
    }

    public class CallClosure
    {
        public int ServiceRequestId { get; set; }
        public string? ClosureRemarks { get; set; }
        public string? SlaBreachedReason { get; set; }
        public string CaseStatusCode { get; set; }
        public int ClosedBy { get; set; }
        public bool IsSlaBreached { get; set; }
        public string HoursSpent { get; set; }
    }
    public class CallClosureDetails
    {
        public string? CustomerName { get; set; }
        public string? PrimaryContactEmail { get; set; }
        public string? EndUserEmail { get; set; }
    }
    public class CallClosureDetailsForMail
    {
        public string? CaseId { get; set; }
        public string? CreatedOn { get; set; }
    }
    public class ServiceRequestDetailsForEmail
    {
        public string? CaseId { get; set; }
        public string? CreatedOn { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? CaseStatus { get; set; }
        public string? CustomerName { get; set; }
        public string? ModelName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? ProductSupportType { get; set; }
        public string? PrimaryContactEmail { get; set; }
    }
    public class PreviousTickets
    {
        public int Id { get; set; }
        public string CaseId { get; set; }
        public string CaseStatus { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string CaseStatusCode { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public DateTime? ClosedOn { get; set; }
    }
    public class InterimRequestReviewDetails
    {
        public string? InterimAssetStatus { get; set; }
        public int ServiceRequestId { get; set; }
        public int? ReviewStatus { get; set; }
        public string ReviewRemarks { get; set; }
    }

    public class ServiceRequestSummary
    {
        public int Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string CallCenterRemarks { get; set; }
        public string MspProvidedSolution { get; set; }
        public DateTime CaseReportedOn { get; set; }
        public string ClosedBy { get; set; }
        public string IncidentId { get; set; }
        public string CallStatus { get; set; }
        public string CallType { get; set; }
        public DateTime ContractStartDate { get; set; }
        public DateTime ContractEndDate { get; set; }
        public string ContractNumber { get; set; }
        public string SiteName { get; set; }
        public string SiteAddress { get; set; }
        public string CustomerSiteState { get; set; }
        public string CustomerSiteCity { get; set; }
        public string CustomerSitePincode { get; set; }
        public string SiteCreatedBy { get; set; }
        public string ResponseTimeInHours { get; set; }
        public string ResolutionTimeInHours { get; set; }
        public string StandByTimeInHours { get; set; }
        public string CustomerName { get; set; }
        public string ProductCategory { get; set; }
        public string ModelNo { get; set; }
        public string Make { get; set; }
        public string Serialno { get; set; }
        public bool VipAsset { get; set; }
        public string WarrantyType { get; set; }
        public DateTime? CallClosedDateTime { get; set; }
        public DateTime CallloggedDateTime { get; set; }
        public string ServiceWindow { get; set; }
        public string? PartCategoryNames { get; set; }
        public string BilledToAddress { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerState { get; set; }
        public string BilledToPincode { get; set; }
        public string ContactEmail { get; set; }
        public string ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public DateTime? EngAssignDateTime { get; set; }
        public string? Engineer { get; set; }
    }

    public class ContractInterimAssetDetails
    {
        public int? CallType { get; set; }
        public int ContractId { get; set; }
        public int ServiceRequestId { get; set; }
        public string? CustomerAssetId { get; set; }
        public int? SiteNameId { get; set; }
        public int IsPreAmcCompleted { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductMakeId { get; set; }
        public int ProductId { get; set; }
        public string? AssetSerialNumber { get; set; }
        public int IsEnterpriseAssetId { get; set; }
        public float ResponseTimeInHours { get; set; }
        public float ResolutionTimeInHours { get; set; }
        public float StandByTimeInHours { get; set; }
        public int IsVipAssetId { get; set; }
        public decimal AmcValue { get; set; }
        public int IsOutSourcingNeededId { get; set; }
        public DateTime? PreAmcCompletedDate { get; set; }
        public int? PreAmcCompletedBy { get; set; }
        public int AssetConditionId { get; set; }
        public int IsPreventiveMaintenanceNeededId { get; set; }
        public int? PreventiveMaintenanceFrequencyId { get; set; }
        public int AssetSupportTypeId { get; set; }
        public DateTime WarrantyStartDate { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public DateTime AmcEndDate { get; set; }
        public DateTime AmcStartDate { get; set; }
        public int ReviewStatus { get; set; }
        public string ReviewRemarks { get; set; }
        public int AssetAddModeId { get; set; }   
        public int? InterimAssetId { get; set; }
    }

    public class MobesureServiceRequestList
    {
        public int? Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerSiteAddress { get; set; }
        public string? EndUserPhone { get; set; }
        public string? CaseStatus { get; set; }
        public string? EndUserName { get; set; }
        public string? CustomerReportedIssue { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public double ResolutionTimeInHours { get; set; }
        public string? ProductMake { get; set; }
        public string? ModelName { get; set; }
        public DateTime? AssignedOn { get; set; }
        public DateTime? ScheduledOn { get; set; }
    }

    public class MobesureServiceRequestDetail
    {
        public int? Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerSiteAddress { get; set; }
        public string? EndUserPhone { get; set; }
        public string? CaseStatus { get; set; }
        public string? EndUserName { get; set; }
        public string? CustomerReportedIssue { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public double ResolutionTimeInHours { get; set; }
        public string? ProductMake { get; set; }
        public string? ModelName { get; set; }
        public bool IsUnderWarranty { get;set; }
        public string CallType { get; set; }
        public string CustomerSiteName { get; set; }
        public string? AssetSerialNumber { get; set; }
        public bool IsEnterpriseProduct{ get; set; }
        public float ResponseTimeInHours { get; set; }
        public float StandByTimeInHours { get; set; }
        public bool IsVipProduct { get; set; }
        public string? CallcenterRemarks { get; set; }
        public string? PrimaryContactName { get; set; }
        public string? PrimaryContactPhone { get; set; }
        public string? PrimaryContactEmail { get; set; }
        public string? CaseId { get; set; }
        public string? CategoryName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public bool IsAccepted { get; set; }
        public string? IncidentId { get; set; }
        public string? CaseReportedCustomerEmployeeName { get; set; }
        public DateTime? CaseReportedOn { get; set; }
        public int? ServiceEngineerVisitId { get; set; }
        public int? ServiceRequestAssignmentId { get; set; }
        public DateTime? VisitStartsOn { get;set; }
        public DateTime? AssignedOn { get; set; }
        public DateTime? ScheduledOn { get; set; }
    }
    public class ServiceRequestEditDetails
    {
        public int ServiceRequestId { get; set; }
        public int ContractId { get; set; }
        public string? IncidentId { get; set; }
        public string? TicketNumber { get; set; }
        public int CaseStatusId { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string CaseReportedCustomerEmployeeName { get; set; }
        public DateTime CaseReportedOn { get; set; }
        public string? EndUserName { get; set; }
        public string? EndUserPhone { get; set; }
        public string? EndUserEmail { get; set; }
        public int CallTypeId { get; set; }
        public string? RepairReason { get; set; }
        public string? CallCenterRemarks { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public bool? IsInterimCaseId { get; set; }
        public int? RemoteSupportNotOptedReason { get; set; }
        public int CustomerContactTypeId { get; set; }
        public int CallSourceId { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public int AssetId { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductMakeId { get; set; }
        public int ProductModelId { get; set; }
        public string ProductSerialNumber { get; set; }
        public string? MspAssetId { get; set; }
        public bool? IsPreAmcCompleted { get; set; }
        public string CustomerAssetId { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ContractNumber { get; set; }
        public int TenantOfficeId { get; set; }
        public string Location { get; set; }
        public string AgreementType { get; set; }
        public string ServiceMode { get; set; }
        public DateTime? CallExpiryDate { get; set; }
        public DateTime? CallStopDate { get; set; }
        public string? CallStopReason { get; set; }
        public string? CustomerContactName { get; set; }
        public string? CustomerSiteName { get; set; }
        public string? CustomerContactEmail { get; set; }
        public string? CustomerContactAddress { get; set; }
        public string? CustomerName { get; set; }
        public string? ContractStatus { get; set; }
        public int? HoursSpent { get; set; }
        public string? ClosureRemarks { get; set; }
        public int? CallSeverityLevelId { get; set; }
    }
    public class ServiceRequestUpdate
    {
        public int Id { get; set; }
        public string? IncidentId { get; set; }
        public string? TicketNumber { get; set; }
        public string? CustomerReportedIssue { get; set; }
        public string? CaseReportedCustomerEmployeeName { get; set; }
        public int? CallStatusId { get; set; }
        public string? EndUserEmail { get; set; }
        public string? EndUserName { get; set; }
        public string? EndUserPhone { get; set; }
        public int CallTypeId { get; set; }
        public string? RepairReason { get; set; }
        public string? CallCenterRemarks { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public bool RemotelyClose { get; set; }
        public bool IsInterimCaseId { get; set; }
        public int? RemoteSupportNotOptedReason { get; set; }
        public int? CustomerContactTypeId { get; set; }
        public int CallSourceId { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public int? HoursSpent { get; set; }
        public string? ClosureRemarks { get; set; }
        public int? CallSeverityLevelId { get; set; }

    }
    public class CallCentreServiceRequest
    {
        public int Id { get; set; }
        public string CaseId { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string ContractNumber { get; set; }
        public string Status { get; set; }
        public string StatusCode { get; set; }
        public string? ModelName { get; set; }
        public string? CategoryName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? EndUserPhone { get; set; }
        public string CustomerName { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string? CallcenterRemarks { get; set; }
        public string? TicketNumber { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public double ResolutionTimeInHours { get; set; }
    }
    public class CallCordinatorServiceRequest
    {
        public int Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? CustomerReportedIssue { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? EndUserPhone { get; set; }
        public string? EndUserName { get; set; }
        public string? ModelName { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string? Assignee { get; set; }
        public string? Status { get; set; }
        public string? StatusCode { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public double ResolutionTimeInHours { get; set; }
    }
    public class CallCentreServiceRequestDetails
    {
        public int Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string CaseId { get; set; }
        public DateTime CaseReportedOn { get; set; }
        public string CaseReportedCustomerEmployeeName { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string? CallCenterRemarks { get; set; }
        public string? IncidentId { get; set; }
        public string CallStatus { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public string? RemoteSupportNotOptedReason { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string? AssignedBy { get; set; }
        public string CallSource { get; set; }
        public string CustomerName { get; set; }
        public string SiteAddress { get; set; }
        public string CustomerCode { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string ContractNumber { get; set; }
        public string? Make { get; set; }
        public string? ModelName { get; set; }
        public string? CategoryName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? Diagnosis { get; set; }
        public string? MspProvidedSolution { get; set; }
        public string? ClosureRemarks { get; set; }
        public string? ClosedBy { get; set; }
        public DateTime? ClosedOn { get; set; }
        public string? HoursSpent { get; set; }
        public string? InterimReviewRemarks { get; set; }
        public string? InterimStatus { get; set; }
        public string? InterimReviewedOn { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ResponseTimeInHours { get; set; }
        public string? ResolutionTimeInHours { get; set; }
        public string? StandByTimeInHours { get; set; }
        public string CallType { get; set; }
        public string CustomerContactType {  get; set; }
        public string? EndUserName {  get; set; }
        public string? EndUserEmail { get; set; }
        public string? EndUserPhone { get; set; }
        public string? RepairReason { get; set; }
    }
    public class CallCordinatorServiceRequestDetails
    {
        public int Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public string? IncidentId { get; set; }
        public DateTime CaseReportedOn { get; set; }
        public string CaseReportedCustomerEmployeeName { get; set; }
        public string CallStatus { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public string? RemoteSupportNotOptedReason { get; set; }
        public string CallType { get; set; }
        public string CustomerContactType { get; set; }
        public string CaseId { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string? CallCenterRemarks { get; set; }
        public string CreatedBy { get; set; }
        public string? EndUserName { get; set; }
        public string? EndUserPhone { get; set; }
        public string? EndUserEmail { get; set; }
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public string SiteAddress { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string? CustomerSiteName { get; set; }
        public string CallStatusCode { get; set; }
        public string ContractNumber { get; set; }
        public string? TicketNumber { get; set; }
    }
    public class InterimServiceRequest
    {
        public int Id { get; set; }
        public string? CaseId { get; set; }
        public string? CustomerName { get; set; }
        public string? ContractNumber { get; set; }
        public string? ModelName { get; set; }
        public string? CategoryName { get; set; }
        public string? EndUserPhone { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string? Status { get; set; }
        public string? StatusCode { get; set; }
        public string? SiteName { get; set; }
        public string? CallSource { get; set; }
        public DateTime? CaseReportedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
    public class ServiceRequestAssetDetails
    {
        public int ProductCategoryId { get; set; }
        public int ContractId { get; set; }
        public string? CategoryName { get; set; }
        public string? Make { get; set; }
        public string? ModelName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? MspAssetId { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public bool IsVipProduct { get; set; }
        public bool IsEnterpriseProduct { get; set; }
        public bool IsOutSourcingNeeded { get; set; }
        public string? ProductCondition { get; set; }
        public string? ResponseTimeInHours { get; set; }
        public string? ResolutionTimeInHours { get; set; }
        public string? StandByTimeInHours { get; set; }
    }    
    public class CallStatusDetails
    {
        public int Id { get; set; }
        public string TenantName { get; set; }
        public string TenantAddress { get; set; }
        public string TenantCityName { get; set; }
        public string TenantStateName { get; set; }
        public string TenantPincode { get; set; }
        public string ContractNumber { get; set; }
        public DateTime ContractStartDate { get; set; }
        public DateTime ContractEndDate { get; set; }
        public string AgreementType { get; set; }
        public string CaseId { get; set; }
        public string? IncidentId { get; set; }
        public string? TicketNumber { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string CustomerReportedIssue { get; set; }
        public string? CallCenterRemarks { get; set; }
        public string CallStatus { get; set; }
        public string CallCreatedBy { get; set; }
        public DateTime CallCreatedOn { get; set; }
        public string CallSource { get; set; }
        public bool OptedForRemoteSupport { get; set; }
        public bool IsInterim { get; set; }
        public string CallType { get; set; }
        public string ServiceMode { get; set; }
        public string CustomerName { get; set; }
        public string SiteName { get; set; }
        public string SiteAddress { get; set; }
        public string SitePincode { get; set; }
        public string? SiteContactName { get; set; }
        public string? SiteContactPhone { get; set; }
        public string? SiteContactEmail { get; set; }
        public string SiteCityName { get; set; }
        public string SiteStateName { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerPincode { get; set; }
        public string? CustomerCityName { get; set; }
        public string? CustomerStateName { get; set; }
        public string? CustomerContactName { get; set; }
        public string? CustomerContactPhone { get; set; }
        public string? CustomerContactEmail { get; set; }
        public string EndUserEmail { get; set; }
        public string EndUserName { get; set; }
        public string EndUserPhone { get; set; }
        public string ProductSerialNumber { get; set; }
        public string CategoryName { get; set; }
        public string? GeneralNotCovered { get; set; }
        public string? SoftwareNotCovered { get; set; }
        public string? HardwareNotCovered { get; set; }
        public string Make { get; set; }
        public string ModelName { get; set; }
        public string? AccelAssetId { get; set; }
        public string WarrantyEndDate { get; set; }
        public int? ResponseTimeInHours { get; set; }
        public int? ResolutionTimeInHours { get; set; }
        public int? StandByTimeInHours { get; set; }
        public DateTime? ResolvedOn { get; set; }
        public DateTime? ClosedOn { get; set; }
        public bool IsPreAmcCompleted { get; set; }
        public bool IsVipProduct { get; set; }
        public string? AssigneeName { get; set; }
        public string? AssignedBy { get; set; }
        public string? AssignedOn { get; set; }
        public string? AssignedFrom { get; set; }
        public string? AssignedTo { get; set; }
        public string? PartsNotCovered { get; set; }
        public string GeneratedBy { get; set; }
    }
    public class CallStatusPartIndentRequestDetails
    {
        public string PartName { get; set; }
        public string? StockType { get; set; }
        public string Description { get; set; }
        public string? Quantity { get; set; }
        public bool IsWarrantyReplacement { get; set; }
        public DateTime RequestedDate { get; set; }
        public string RequestedBy { get; set; }
        public DateTime ApprovedDate { get; set; }
        public string PartIndentRequestStatus { get; set; }
    }
    public class CallStatusPartAllocationDetails
    {
        public string? AllocatedBy { get; set; }
        public string? ReceivedBy { get; set; }
        public DateTime? AllocatedOn { get; set; } 
        public DateTime ?ReceivedOn { get; set; }
       
    }
    public class CallStatusServiceEngineerVisitsClosureDetails
    {
        public string? ServiceEngineer { get; set; }
        public string? EmployeeCode { get; set; }
        public DateTime? AssignedOn { get; set; }
        public DateTime? ScheduledOn { get; set; }
        public DateTime? AcceptedOn { get; set; }
        public DateTime? VisitStartsOn { get; set; }
        public DateTime? VisitEndsOn { get; set; }
        public string? Remarks { get; set; }
        public string? CallStatus { get; set; }

    }

    public class MobesurePreviousCallList
    {
        public int? Id { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerSiteAddress { get; set; }
        public string? CaseStatus { get; set; }
        public string? CustomerReportedIssue { get; set; }
        public DateTime? WorkOrderCreatedOn { get; set; }
        public string? ProductMake { get; set; }
        public string? ModelName { get; set; }
        public DateTime? AssignedOn { get; set; }
    }
    public class CallCordinatorServiceRequestCounts
    {
        public int? TotalCalls { get; set; }
        public int? NewCalls { get; set; }
        public int? CallResolved { get; set; }
        public int? EngAccepted { get; set; }
        public int? EngNotAccepted { get; set; }
        public int? VisitStarted { get; set; }
        public int? VisitClosed { get; set; }
        public int? OnsiteClosed { get; set; }
        public int? RemotelyClosed { get; set; }        
    }
    public class PartCategoryList
    {
        public int? Id { get; set;}
        public string? Name { get; set;}
    }
    public class PartSubCategoryList
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
    }
    public class ServiceRequestDetailsListForSme
    {
        public int? Id { get; set; }
        public string? CaseId { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? ContractNumber { get; set; }
        public string? Status { get; set; }
        public string? StatusCode { get; set; }
        public string? ModelName { get; set; }
        public string? CategoryName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerServiceAddress { get; set; }
        public string? EndUserPhone { get; set; }
        public string? CustomerReportedIssue { get; set; }
        public string? CallcenterRemarks { get; set; }
        public string? CreatedBy { get; set; }
        public string? ResolutionTimeInHours { get; set; }
        public string? WorkOrderCreatedOn { get; set; }
    }
    public class PartIndentRequestDetailsListForSme
    {
        public int? PartIndentRequestId { get; set; }
        public int? PartIndentRequestDetailId { get; set; }
        public bool? IsWarrantyReplacement { get; set; }
        public string? PartCode { get; set; }
        public string? PartName { get; set; }
        public string? HsnCode { get; set; }
        public int? StockTypeId { get; set; }
        public string? StockType { get; set; }
        public int? Quantity { get; set; }
        public string? PartCategoryName { get; set; }
        public string? PartRequestStatus { get; set; }
        public string? PartRequestStatusCode { get; set; }
        public string? ReviewerComments { get; set; }
        public string? IndentRequestNumber { get; set; }
    }
    public class PartIndentRequestStatusCountForSme
    {
        public string? New { get; set; }
        public string? Hold { get; set; }
        public string? Approved { get; set; }
        public string? Rejected { get; set; }

    }
    public class InterimPreAmcAssetDetail
    {
        public DateTime? PreAmcCompletedDate { get; set; }
        public int? PreAmcCompletedBy { get; set; }
        public int ServiceRequestId { get; set; }
        public int IsPreAmcCompleted { get; set; }
        public string? ReviewRemarks { get; set; }
    }
}