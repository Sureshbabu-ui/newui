using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractInvoicePrerequisite
    {
        public int Id { get; set; }
        [ForeignKey("InvoicePrerequisiteId")]
        public int InvoicePrerequisiteId { get; set; }
        public InvoicePrerequisite InvoicePrerequisite { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? DocumentName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Description { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
