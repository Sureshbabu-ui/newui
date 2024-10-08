using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class EventConditionMasterTable
    {
        public int Id { get; set; }
        [ForeignKey("ApprovalEventId")]
        public int ApprovalEventId { get; set; }
        public ApprovalEvent? ApprovalEvent { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string TableName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string DisplayName { get; set; }
        public int Sequence { get; set; }
        [DefaultValue(true)]
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
