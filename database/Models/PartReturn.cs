using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PartReturn
    {
        public int Id { get; set; }
        [ForeignKey("ServiceRequestId")]
        public int ServiceRequestId { get; set; }
        public ServiceRequest? ServiceRequest { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? SerialNumber { get; set; }
        [StringLength(32)]
        public string? Barcode { get; set; }
        [Column(TypeName = "date")]
        public DateTime? WarrantyEndDate { get; set; }
        [ForeignKey("PartId")]
        public int? PartId { get; set; }
        public Part? Part { get; set; }
        [ForeignKey("PartStockId")]
        public int? PartStockId { get; set; }
        public PartStock? PartStock { get; set; }
        [ForeignKey("MasterEntityData")]
        public int ReturnedPartTypeId { get; set; }
        public MasterEntityData? ReturnedPartType { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime ReturnInitiatedOn { get; set; }
        public int ReturnInitiatedBy { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? ReturnRemarks { get; set; }
        [ForeignKey("ReceivingLocationId")]
        public int? ReceivingLocationId { get; set; }
        public TenantOffice? ReceivingLocation { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReceivedOn { get; set; }
        public int? ReceivedBy { get; set; }
    }
}
