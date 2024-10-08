using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class DocumentNumberFormat
    {
        public int Id { get; set; }
        [ForeignKey("DocumentTypeId")]
        public int DocumentTypeId { get; set; }
        public MasterEntityData? DocumentType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Format { get; set; }
        [DefaultValue(0)]
        public int NumberPadding { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}
