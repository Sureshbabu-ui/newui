using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class PlannedJob
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string CommandName { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string Params { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime FirstRunOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? LastRunOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string Schedule { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
