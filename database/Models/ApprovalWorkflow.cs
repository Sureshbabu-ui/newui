using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(Name), IsUnique = true)]
    public class ApprovalWorkflow
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string Name { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string Description { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        public int? ModifiedBy { get; set; }
    }
}
