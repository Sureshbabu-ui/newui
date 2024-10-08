using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(InvoiceId), nameof(TdsPaidAmount), IsUnique = true)]
    public class InvoiceReconciliationTdsUpload
    {
        public int Id { get; set; }
        [ForeignKey("InvoiceId")]
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal TdsPaidAmount { get; set; }
        public int UploadedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime UploadedOn { get; set; }
    }
}
