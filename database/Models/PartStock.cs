using BeSureApi.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PartStock
    {
        public int Id { get; set; }
        [ForeignKey("PartId")]
        public int? PartId { get; set; }
        public Part? Part { get; set; }
        [ForeignKey("GrnDetailId")]
        public int? GrnDetailId { get; set; }
        public GoodsReceivedNoteDetail? GrnDetail { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string SerialNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Barcode { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Rate { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int? TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [ForeignKey("StockRoomId")]
        public int? StockRoomId { get; set; }
        public StockRoom? StockRoom { get; set; }
        [ForeignKey("StockBinId")]
        public int? StockBinId { get; set; }
        public StockBin? StockBin { get; set; }
        [ForeignKey("MasterEntityData")]
        public int StockTypeId { get; set; }
        public MasterEntityData? StockType { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? StockClassificationId { get; set; }
        public MasterEntityData? StockClassification { get; set; }
        [Column(TypeName = "date")]
        public DateTime? PartWarrantyExpiryDate { get; set; }
        public int? PartOutwardStatusId { get; set; }
        [ForeignKey("PartOutwardStatusId")]
        public PartOutwardStatus? PartOutwardStatus { get; set; }
        [ForeignKey("ReplacedPartId")]
        public int? ReplacedPartId { get; set; }
        public Part? ReplacedPart { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? ReplacementReason { get; set; }
        [DefaultValue(1)]
        public bool IsPartAvailable { get; set; }
        [DefaultValue(0)]
        public bool IsStandby { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}
