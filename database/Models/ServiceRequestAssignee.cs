using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ServiceRequestAssignee
    {
        public int Id { get; set; }
        [ForeignKey("ServiceRequestId")]
        public int ServiceRequestId { get; set; }
        public ServiceRequest? ServiceRequest { get; set; }
        public int AssigneeId { get; set; }
        [ForeignKey("AssigneeId")]
        public UserInfo? Assignee { get; set; }
        [DefaultValue(false)]
        public bool IsAssigneeAccepted { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)] 
        public string? Remarks { get; set; }
        public DateTime StartsFrom { get; set; }
        public DateTime? EndsOn { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? DeletedReason { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AcceptedOn { get; set; }
        public int CreatedBy { get; set; }
    }
}
