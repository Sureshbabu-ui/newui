using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractHistory
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? ContractNumber { get; set; }
        public int CustomerInfoId { get; set; }
        public int TenantOfficeId { get; set; }
        [ForeignKey("MasterEntityData")]
        public int AgreementTypeId { get; set; }
        public MasterEntityData? AgreementType { get; set; }
        [ForeignKey("MasterEntityData")]
        public int BookingTypeId { get; set; }
        public MasterEntityData? BookingType { get; set; }
        [Column(TypeName = "date")]
        public DateTime? BookingDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime BookingValueDate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal ContractValue { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal AmcValue { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal FmsValue { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? QuotationReferenceNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? QuotationReferenceDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? PoNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? PoDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime EndDate { get; set; }
        [DefaultValue(false)]
        public bool IsPerformanceGuaranteeRequired { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? PerformanceGuaranteeAmount { get; set; }
        [DefaultValue(false)]
        public bool IsMultiSite { get; set; }
        public short? SiteCount { get; set; }
        [DefaultValue(false)]
        public bool IsPreAmcNeeded { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? ServiceModeId { get; set; }
        public MasterEntityData? ServiceMode { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? PaymentModeId { get; set; }
        public MasterEntityData? PaymentMode { get; set; }
        [ForeignKey("PaymentFrequencyId")]
        public int? PaymentFrequencyId { get; set; }
        public PaymentFrequency? PaymentFrequency { get; set; }
        [DefaultValue(false)]
        public bool IsPmRequired { get; set; }
        [DefaultValue(false)]
        public bool IsSez { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? PmFrequencyId { get; set; }
        public MasterEntityData? PmFrequency { get; set; }
        [DefaultValue(false)]
        public bool IsBackToBackAllowed { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? BackToBackScopeId { get; set; }
        public MasterEntityData? BackToBackScope { get; set; }
        public int? CreditPeriod { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? ServiceWindowId { get; set; }
        public MasterEntityData? ServiceWindow { get; set; }
        [DefaultValue(false)]
        public bool IsStandByFullUnitRequired { get; set; }
        [DefaultValue(false)]
        public bool IsStandByImprestStockRequired { get; set; }
        public int? OldContractId { get; set; }
        [ForeignKey("MasterEntityData")]
        public int ContractStatusId { get; set; }
        public MasterEntityData? ContractStatus { get; set; }
        public int? FirstApproverId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? FirstApprovedOn { get; set; }
        public int? SecondApproverId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? SecondApprovedOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string? ReviewComment { get; set; }
        public int? SalesContactPersonId { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CallExpiryDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CallStopDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? CallStopReason { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime EffectiveFrom { get; set;}
        [Column(TypeName = "datetime")]
        public DateTime EffectiveTo { get; set; }
    }
}
