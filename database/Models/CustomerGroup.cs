using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(GroupCode), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(GroupName), IsUnique = true)]
    public class CustomerGroup
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string GroupCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string GroupName { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
