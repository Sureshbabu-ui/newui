using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class InvoiceReconciliation
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal NetInvoiceAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal TdsDeductedAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal TdsPaidAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal GstTdsDeductedAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal GstTdsPaidAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal PenaltyAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal SecurityDepositAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal CustomerExpenseAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal OtherDeductionAmount { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? OtherDeductionRemarks { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal CollectedAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal WriteOffAmount { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? WriteOffAmountRemarks { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal OutstandingAmount { get; set; }
        [Column(TypeName = "date")]
        public DateTime StatusDate { get; set; }
        public int PrimaryAccountableId { get; set; }
        public int SecondaryAccountableId { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}