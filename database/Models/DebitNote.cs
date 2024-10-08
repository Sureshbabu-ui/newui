using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{    public class DebitNote
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string DebitNoteNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DebitNoteDate { get; set; }
        [ForeignKey("CustomerId")]
        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }
        [ForeignKey("VendorId")]
        public int? VendorId { get; set; }
        public Vendor? Vendor { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal Amount { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}
