using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(Code), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(CategoryName), IsUnique = true)]
    public class PartProductCategory
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CategoryName { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
    }
}