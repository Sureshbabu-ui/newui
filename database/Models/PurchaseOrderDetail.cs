using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PurchaseOrderDetail
    {
        public int Id { get; set; }
        [ForeignKey("PurchaseOrderId")]
        public int PurchaseOrderId { get; set; }
        public PurchaseOrder? PurchaseOrder { get; set; }
        [ForeignKey("PartIndentRequestId")]
        public int? PartIndentRequestId { get; set; }
        public PartIndentRequest? PartIndentRequest { get; set; }
        [ForeignKey("PartId")]
        public int PartId { get; set; }
        public Part? Part { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? PartName { get; set; }
        [ForeignKey("MasterEntityData")]
        public int PoPartTypeId { get; set; }
        public MasterEntityData? PoPartType { get; set; }
        [DefaultValue(0)]
        public bool IsExchangable { get; set; }
        [DefaultValue(0)]
        public int WarrantyPeriodInDays { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(8,2)")]
        public decimal Quantity { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(8,2)")]
        public decimal GrnReceivedQuantity { get; set; }
        public int Unit { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal Price { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(8,2)")]
        public decimal CgstRate { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(8,2)")]
        public decimal SgstRate { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(8,2)")]
        public decimal IgstRate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
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