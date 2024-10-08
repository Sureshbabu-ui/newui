using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class UserBusinessUnit
    {
        public int Id { get; set; }
        [ForeignKey("MasterEntityData")]
        public int BusinessUnitId { get; set; }
        public MasterEntityData? BusinessUnit { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public UserInfo? User { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
