using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(TicketNumber), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(CaseId), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(WorkOrderNumber), IsUnique = true)]

    public class ServiceRequest
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string CaseId { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? IncidentId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? TicketNumber { get; set; }
        [DefaultValue(false)]
        public bool IsInterimCaseId { get; set; }
        [DefaultValue(false)]
        public bool IsInterimCaseAssetApprovalNeeded { get; set; }
        [DefaultValue(false)]
        public bool IsInterimCaseFinanceApprovalNeeded { get; set; }
        public int? InterimCaseAssetApprovedBy { get; set; }
        public int? InterimCaseFinanceAprovedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? InterimCaseAssetApprovedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? InterimCaseFinanceAprovedOn { get; set; }
        [ForeignKey("MasterEntityData")]
        public int CallTypeId { get; set; }
        public MasterEntityData? CallType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? WorkOrderNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? WorkOrderCreatedOn { get; set; }
        [ForeignKey("MasterEntityData")]
        public int CaseStatusId { get; set; }
        public MasterEntityData? CaseStatus { get; set; }
        public int? ServiceRequestAssignmentId { get; set; }
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
        [DefaultValue(false)]
        public bool OptedForRemoteSupport { get; set; }
        public int? RemoteSupportNotOptedReason { get; set; }
        [ForeignKey("CustomerInfoId")]
        public int? CustomerInfoId { get; set; }
        public CustomerInfo? CustomerInfo { get; set; }
        [ForeignKey("CustomerSiteId")]
        public int? CustomerSiteId { get; set; }
        public CustomerSite? CustomerSite { get; set; }
        public int? ContractAssetId { get; set; }
        [ForeignKey("ContractAssetId")]
        public ContractAssetDetail? ContractAssetDetail { get; set; }
        public int? ContractInterimAssetId { get; set; }
        [ForeignKey("MasterEntityData")]
        public int CustomerContactTypeId { get; set; }
        public MasterEntityData? CustomerContactType { get; set; }
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
        [StringLength(128)]
        public string? CustomerServiceAddress { get; set; }
        [ForeignKey("MasterEntityData")]
        public int CallSourceId { get; set; }
        public MasterEntityData? CallSource { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)] 
        public string? CallcenterRemarks { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? ClosureRemarks { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ResolvedOn { get; set; }
        public int? ResolvedBy { get; set; }
        [Column(TypeName = "decimal(6,2)")]
        public decimal? HoursSpent { get; set; }
        [DefaultValue(false)]
        public bool IsSlaBreached { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? SlaBreachedReason { get; set; }
        [ForeignKey("CallSeverityLevelId")]
        public int? CallSeverityLevelId { get; set; }
        public MasterEntityData? CallSeverityLevel { get; set; }
        public int? ClosedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ClosedOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? RepairReason { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2048)]
        public string? InterimReviewRemarks { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        public int CreatedBy{ get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}