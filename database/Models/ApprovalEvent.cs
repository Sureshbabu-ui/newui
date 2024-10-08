using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(EventCode), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(EventName), IsUnique = true)]
    public class ApprovalEvent
    {
        public int Id { get; set; }
        [ForeignKey("EventGroupId")]
        public int EventGroupId { get; set; }
        public EventGroup? EventGroup { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string EventCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string EventName { get; set; }
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
