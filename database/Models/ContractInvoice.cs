using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractInvoice
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
        [ForeignKey("ContractInvoiceScheduleId")]
        public int ContractInvoiceScheduleId { get; set; }
        public ContractInvoiceSchedule ContractInvoiceSchedule { get; set; }
        [ForeignKey("InvoiceId")]
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string? InvoicePendingReason { get; set; }
    }
}
