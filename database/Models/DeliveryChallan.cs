using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class DeliveryChallan
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string DcNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DcDate { get; set; }
        [ForeignKey("MasterEntityData")]
        public int DcTypeId { get; set; }
        public MasterEntityData? DcType { get; set; }
        [ForeignKey("SourceTenantOfficeId")]
        public int SourceTenantOfficeId { get; set; }
        public TenantOffice? SourceTenantOffice { get; set; }

        [ForeignKey("DestinationTenantOfficeId")]
        public int? DestinationTenantOfficeId { get; set; }
        public TenantOffice? DestinationTenantOffice { get; set; }
        [ForeignKey("DestinationEmployeeId")]
        public int? DestinationEmployeeId { get; set; }
        public UserInfo? DestinationEmployee { get; set; }
        [ForeignKey("DestinationVendorId")]
        public int? DestinationVendorId { get; set; }
        public Vendor? DestinationVendor { get; set; }
        [ForeignKey("DestinationCustomerSiteId")]
        public int? DestinationCustomerSiteId { get; set; }
        public CustomerSite? DestinationCustomerSite { get; set; }
        [ForeignKey("IssuedEmployeeId")]
        public int IssuedEmployeeId { get; set; }
        public UserInfo? IssuedEmployee { get; set; }
        [ForeignKey("LogisticsVendorId")]
        public int? LogisticsVendorId { get; set; }
        public Vendor? LogisticsVendor { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? LogisticsReceiptNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? LogisticsReceiptDate { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? ModeOfTransport { get; set; }
        public MasterEntityData? TransportationMode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? TrackingId { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}
