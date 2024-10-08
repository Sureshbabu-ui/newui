using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class InvoiceReceipt
    {
        public int Id { get; set; }
        [ForeignKey("ReceiptId")]
        public int ReceiptId { get; set; }
        public Receipt Receipt { get; set; }
        [ForeignKey("InvoiceId")]
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? Amount { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
    }
}
