using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class BusinessSetting
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string ContractNumberFormat { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string InvoiceNumberFormat { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CustomerNumberFormat { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string WorkOrderNumberFormat { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string ReceiptNumberFormat { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string DebitNoteNumberFormat { get; set; }
    }
}
