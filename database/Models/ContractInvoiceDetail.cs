using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
namespace database.Models
{
    public class ContractInvoiceDetail
    {
        public int Id { get; set; }
        [ForeignKey("ContractInvoiceId")]
        public int ContractInvoiceId { get; set; }
        public ContractInvoice ContractInvoice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string ItemDescription{ get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string ServicingAccountingCode { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Quantity { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Unit { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Rate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Amount { get; set; }

        [Column(TypeName = "decimal(16,2)")]
        public decimal Discount{ get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Sgst { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Cgst { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal Igst { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal NetAmount { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(0)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
