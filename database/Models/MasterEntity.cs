using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class MasterEntity
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string EntityType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Description { get; set; }
        [DefaultValue(false)]
        public bool IsSystemData { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}