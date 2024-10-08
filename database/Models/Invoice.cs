using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        [ForeignKey("MasterEntityData")]
        public int InvoiceTypeId { get; set; }
        public MasterEntityData? InvoiceType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string InvoiceNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime InvoiceDate { get; set; }
        [ForeignKey("CustomerInfoId")]
        public int? CustomerInfoId { get; set; }
        public CustomerInfo? CustomerInfo { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Description { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal InvoiceAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? DeductionAmount { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? DeductionDescription { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Sgst { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Cgst { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Igst { get; set; }
        [Column(TypeName = "date")]
        public DateTime CollectionDueDate { get; set; }
        [ForeignKey("MasterEntityData")]
        public int InvoiceStatus { get; set; }
        public MasterEntityData? ContractInvoiceStatus { get; set; }
        [DefaultValue(false)]
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
