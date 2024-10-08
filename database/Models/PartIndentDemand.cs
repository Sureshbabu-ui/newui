using Bogus.DataSets;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PartIndentDemand
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string DemandNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime DemandDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string WorkOrderNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? PartIndentRequestNumber { get; set; }
        [ForeignKey("PartIndentRequestDetailId")]
        public int PartIndentRequestDetailId { get; set; }
        public PartIndentRequestDetail? PartIndentRequestDetail { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [ForeignKey("PartId")]
        public int PartId { get; set; }
        public Part? Part { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal Quantity { get; set; }
        [ForeignKey("MasterEntityData")]
        public int UnitOfMeasurementId { get; set; }
        public MasterEntityData? UnitOfMeasurement { get; set; }
        [ForeignKey("VendorId")]
        public int? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        [ForeignKey("MasterEntityData")]
        public int StockTypeId { get; set; }
        public MasterEntityData? StockType { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? Price { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        [ForeignKey("MasterEntityData")]
        public int DemantNoteStatusId { get; set; }
        public MasterEntityData? DemantNoteStatus { get; set; }
        [DefaultValue(false)]
        public bool IsWarrantyReplacement { get; set; }
        public int? WarrantyPeriod { get; set; }
        [DefaultValue(false)]
        public bool IsCwhAttentionNeeded { get; set; }
        [DefaultValue(false)]
        public bool IsCwhProcessed { get; set; }
        public string CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
