using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class EventConditionMasterColumn
    {
        public int Id { get; set; }
        [ForeignKey("EventConditionMasterTableId")]
        public int EventConditionMasterTableId { get; set; }
        public EventConditionMasterTable? EventConditionMasterTable { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string ColumnName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string DisplayName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string ValueType { get; set; }
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
