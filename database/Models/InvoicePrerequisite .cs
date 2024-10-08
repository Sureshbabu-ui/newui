using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(DocumentCode), IsUnique = true)]
    public class InvoicePrerequisite
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string DocumentName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string DocumentCode { get; set; }
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
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
