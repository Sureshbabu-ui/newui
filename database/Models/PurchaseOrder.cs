using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PurchaseOrder
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string PoNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime PoDate { get; set; }
        [ForeignKey("VendorId")]
        public int VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        [ForeignKey("VendorBranchId")]
        public int? VendorBranchId { get; set; }
        public VendorBranch? VendorBranch { get; set; }
        public int? PoApprovedBy { get; set; }
        public DateTime? PoApprovedOn { get; set; }
        public int? PoCancelledBy { get; set; }
        [Column(TypeName = "date")]
        public DateTime? PoCancelledOn { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        public int BillToTenantOfficeInfoId { get; set; }
        [ForeignKey("BillToTenantOfficeInfoId")]
        public TenantOfficeInfo? BillToTenantOffice { get; set; }
        public int? ShipToTenantOfficeInfoId { get; set; }
        [ForeignKey("ShipToTenantOfficeInfoId")]
        public TenantOfficeInfo? ShipToTenantOffice { get; set; }
        [ForeignKey("ShipToCustomerSiteId")]
        public int? ShipToCustomerSiteId { get; set; }
        public CustomerSite? CustomerSite { get; set; }
        [ForeignKey("PoStatusId")]
        public int PoStatusId { get; set; }
        public MasterEntityData? PoStatus { get; set; }
        [ForeignKey("PaymentTermsId")]
        public int? PaymentTermsId { get; set; }
        public MasterEntityData? PaymentTerms { get; set; }
        [DefaultValue(0)]
        public int ExpectedDeliveryInDays { get; set; }
        [ForeignKey("ShipmentModeId")]
        public int? ShipmentModeId { get; set; }
        public MasterEntityData? ShipmentMode { get; set; }
        [ForeignKey("PaymentModeId")]
        public int? PaymentModeId { get; set; }
        public MasterEntityData? PaymentMode { get; set; }
        [ForeignKey("CurrencyCodeId")]
        public int? CurrencyCodeId { get; set; }
        public MasterEntityData? CurrencyCode { get; set; }
        [ForeignKey("PartDeliveryTermId")]
        public int? PartDeliveryTermId { get; set; }
        public MasterEntityData? PartDeliveryTerm { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Description { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}